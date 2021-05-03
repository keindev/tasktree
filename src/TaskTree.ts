import UpdateManager from 'stdout-update';

import { Task } from './Task';
import { Theme, ThemeOptions } from './Theme';

export enum ExitCode {
  Success = 0,
  Error = 1,
}

export interface ITaskTreeOptions {
  /** Disable task tree rendering */
  silent?: boolean;
  /** Removes all subtasks and bars from the main task */
  autoClear?: boolean;
}

/** Singleton to manage the task tree */
export class TaskTree {
  static readonly TIMEOUT = 100;
  private static instance: TaskTree;

  #handle: NodeJS.Timeout | undefined;
  #tasks: Task[];
  #theme: Theme;
  #manager: UpdateManager;
  #silent = false;
  #autoClear = false;
  #started = false;
  #offset = 0;

  private constructor(theme?: ThemeOptions) {
    this.#tasks = [];
    this.#theme = new Theme(theme);
    this.#manager = UpdateManager.getInstance();
  }

  /**
   * Method to get the object to control the tree
   *
   * @param theme - Theme properties. The field name is a modifier the value is options
   * @example
   * ```javascript
   * const theme = {
   *   default: '#ffffff',
   *   success: ['#008000', '✔'],
   *   skip: {
   *     symbol: '↓',
   *   },
   *   error: ['#ff0000', '✖', '[error]'],
   *   ...
   * };
   * ```
   * @description
   * | option      | color             | symbol | badge | description                                  |
   * | ----------- | ----------------- | ------ | ----- | -------------------------------------------- |
   * | **default** | text              | ✖      | ✖     | default color                                |
   * | **active**  | symbol            | ✔      | ✖     | spinner, progress bar color                  |
   * | **success** | symbol, text, bar | ✔      | ✖     | task symbol, progress bar color              |
   * | **skip**    | symbol, text, bar | ✔      | ✔     | task symbol, progress bar color              |
   * | **error**   | symbol, text, bar | ✔      | ✔     | task symbol, error title, progress bar color |
   * | **message** | symbol            | ✔      | ✖     | dim pointer to task information              |
   * | **info**    | symbol            | ✔      | ✖     | information message symbol                   |
   * | **warning** | symbol            | ✔      | ✖     | warning message symbol                       |
   * | **subtask** | symbol, text      | ✔      | ✖     | dim pointer to subtask                       |
   * | **list**    | symbol            | ✔      | ✖     | list symbol                                  |
   * | **dim**     | symbol, bar       | ✖      | ✖     | dim color                                    |
   *
   * > If you use a gradient fill for the progress bar - the color will change from `active` to `success`
   */
  static tree(theme?: ThemeOptions): TaskTree {
    if (!TaskTree.instance) TaskTree.instance = new TaskTree(theme);

    return TaskTree.instance;
  }

  /** Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task */
  static add(text: string): Task {
    return TaskTree.tree().add(text);
  }

  /** Fail active task or adds a new subtask and call fail on it */
  static fail(error: string | Error, active = true): never {
    return TaskTree.tree().fail(error, active);
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
      this.#handle = setInterval((): void => {
        this.log();
      }, TaskTree.TIMEOUT);
    }

    return this;
  }

  /** Stop output a task tree in a terminal */
  stop(): TaskTree {
    this.#started = false;

    if (this.#handle) {
      clearInterval(this.#handle);

      this.log();
      this.#manager.unhook();
      this.#handle = undefined;
    }

    return this;
  }

  /** Force the process to exit (see process.exit). Do nothing in "silent mode" */
  exit(code: ExitCode = ExitCode.Success, error?: string | Error): void | never {
    if (this.#started) {
      this.stop();

      if (this.#silent) {
        if (code === ExitCode.Error) throw error instanceof Error ? error : new Error(error);
      } else {
        // eslint-disable-next-line no-process-exit
        process.exit(code);
      }
    } else if (code === ExitCode.Error) {
      throw error instanceof Error ? error : new Error(error);
    }
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

  /**
   * Fail active task or adds a new subtask and call fail on it
   * @param error - Text or Error object for display
   * @param active - If `true` - call failed for active task, else create new task and call fail on it
   */
  fail(error: string | Error, active = true): never {
    const errorObject = error instanceof Error ? error : new Error(error);

    if (!this.#started || this.#silent) {
      throw errorObject;
    } else {
      let task = this.#tasks[this.#tasks.length - 1];

      task = active && task && task.isPending ? task.activeSubtask : this.add(errorObject.name);

      return task.error(errorObject, true) as never;
    }
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

  private log(): void {
    const offset = this.#offset;

    this.#offset = 0;
    this.#manager.update(this.render(), offset);
  }
}

export default TaskTree;
