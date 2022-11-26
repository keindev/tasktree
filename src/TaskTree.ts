import UpdateManager from 'stdout-update';

import { Task } from './Task.js';
import { Theme, ThemeOptions } from './Theme.js';

export enum ExitCode {
  Success = 0,
  Error = 1,
}

export interface ITaskTreeOptions {
  /** Removes all subtasks and bars from the main task */
  autoClear?: boolean;
  /** Disable task tree rendering */
  silent?: boolean;
}

/** Singleton to manage the task tree */
export class TaskTree {
  static readonly TIMEOUT = 100;
  private static instance: TaskTree;

  #autoClear = false;
  #handle: NodeJS.Timeout | undefined;
  #manager: UpdateManager;
  #offset = 0;
  #paused = false;
  #silent = false;
  #started = false;
  #tasks: Task[];
  #theme: Theme;

  private constructor(theme?: ThemeOptions) {
    this.#tasks = [];
    this.#theme = new Theme(theme);
    this.#manager = UpdateManager.getInstance();
  }

  /** Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task */
  static add(text: string): Task {
    return TaskTree.tree().add(text);
  }

  /** Fail active task or adds a new subtask and call fail on it */
  static fail(error: string | Error | unknown, active = true): never {
    return TaskTree.tree().fail(error, active);
  }

  /**
   * Method to get the object to control the tree
   *
   * @param theme - Theme properties. The field name is a modifier the value is options
   * @example
   * ```typescript
   * const theme = {
   *   default: '#ffffff',
   *   success: ['#008000', '✔'],
   *   skip: {
   *     symbol: '↓',
   *   },
   *   error: ['#ff0000', '✖', '[error]'],
   *   ...
   * };
   *
   * const tree = TaskTree.tree();
   *
   * // start task tree log update in terminal
   * tree.start();
   * ```
   * @description
   * | Type    | `badge`  | `color`                       |  `symbol`   | Description                                  |
   * | :------ | :------: | :---------------------------- | :---------: | :------------------------------------------- |
   * | default |    ✖     | `[default]` - text            |     `-`     | default color                                |
   * | active  |    ✖     | `#4285f4` - symbol            | `frame (⠧)` | spinner, progress bar color                  |
   * | success |    ✖     | `#00c851` - symbol, text, bar |      ✔      | task symbol, progress bar color              |
   * | skip    | `[skip]` | `#ff8800` - symbol, text, bar |      ↓      | task symbol, progress bar color              |
   * | error   | `[fail]` | `#ff4444` - symbol, text, bar |      ✖      | task symbol, error title, progress bar color |
   * | message |    ✖     | `#2e2e2e` - symbol            |      ─      | dim pointer to task information              |
   * | info    |    ✖     | `#33b5e5` - symbol            |      ℹ      | information message symbol                   |
   * | warning |    ✖     | `#ffbb33` - symbol            |      ⚠      | warning message symbol                       |
   * | subtask |    ✖     | `#2e2e2e` - symbol, text      |      ›      | dim pointer to subtask                       |
   * | list    |    ✖     | `#4285f4` - symbol            |      ❯      | list symbol                                  |
   * | dim     |    ✖     | `#838584` - symbol, bar       |     `-`     | dim color                                    |
   *
   * > If you use a gradient fill for the progress bar - the color will change from `active` to `success`
   */
  static tree(theme?: ThemeOptions): TaskTree {
    if (!TaskTree.instance) TaskTree.instance = new TaskTree(theme);

    return TaskTree.instance;
  }

  /**
   * Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task
   * @param text - Text for display
   */
  add(text: string): Task {
    let task = this.#tasks[this.#tasks.length - 1];

    if (task && task.isPending) {
      task = task.activeSubtask;
      task = task.add(text);
    } else {
      this.#tasks.push((task = new Task(text, { autoClear: this.#autoClear })));
    }

    return task;
  }

  /** Force the process to exit (see process.exit). Do nothing in "silent mode" */
  exit(code: ExitCode = ExitCode.Success, error?: string | Error | unknown): void | never {
    if (this.#started) {
      this.stop();

      if (this.#silent) {
        if (code === ExitCode.Error) throw this.getError(error);
      } else {
        // eslint-disable-next-line no-process-exit
        process.exit(code);
      }
    } else if (code === ExitCode.Error) {
      throw this.getError(error);
    }
  }

  /**
   * Fail active task or adds a new subtask and call fail on it
   * @param error - Text or Error object for display
   * @param active - If `true` - call failed for active task, else create new task and call fail on it
   */
  fail(error: string | Error | unknown, active = true): never {
    const errorObject = this.getError(error);

    if (!this.#started || this.#silent) {
      throw errorObject;
    } else {
      let task = this.#tasks[this.#tasks.length - 1];

      task = active && task && task.isPending ? task.activeSubtask : this.add(errorObject.name);

      return task.error(errorObject, true) as never;
    }
  }

  /**
   * Pause tree render for external output
   * @param cb - external output callback (runs after hook suspend) and returns count of rows to be erased
   */
  async pause(cb: () => Promise<number | void>): Promise<void> {
    this.#paused = true;
    this.#manager.suspend();

    const count = (await cb()) ?? 0;

    this.#manager.resume(count);
    this.#offset = 0;
    this.#paused = false;
  }

  /** Render a task tree into a `string[]`. Returns strings with tasks hierarchy */
  render(): string[] {
    let updatable = false;
    let rows: string[];
    let exclude = 0;

    const output = this.#tasks.reduce<string[]>((acc, task): string[] => {
      rows = task.render(this.#theme);
      updatable = updatable || task.isPending;

      if (!updatable) {
        this.#offset += rows.length;
        exclude++;
      }

      return acc.concat(rows);
    }, []);

    if (exclude) this.#tasks = this.#tasks.slice(exclude);

    return output;
  }

  /** Starts output a task tree in a terminal at a defined interval. In “silent mode” - the task tree only collects tasks and is not output it in a terminal */
  start({ silent, autoClear }: ITaskTreeOptions = {}): TaskTree {
    this.#silent = !!silent;
    this.#autoClear = !!autoClear;
    this.#tasks = [];
    this.#offset = 0;
    this.#started = true;

    if (!this.#handle && !this.#silent) {
      this.#manager.hook();
      this.#handle = setInterval(() => this.update(), TaskTree.TIMEOUT);
    }

    return this;
  }

  /** Stop output a task tree in a terminal */
  stop(): TaskTree {
    this.#started = false;

    if (this.#handle) {
      clearInterval(this.#handle);

      this.update();
      this.#manager.unhook();
      this.#handle = undefined;
    }

    return this;
  }

  private getError(error: string | Error | unknown): Error {
    const obj = error instanceof Error ? error : new Error(typeof error === 'string' ? error : '');

    return obj;
  }

  private update(): void {
    if (!this.#paused || (this.#paused && !this.#started)) {
      const offset = this.#offset;

      this.#offset = 0;
      this.#manager.update(this.render(), offset);
    }
  }
}

export default TaskTree;
