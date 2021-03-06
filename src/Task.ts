import chalk from 'chalk';

import { IProgressBarOptions, Progress, ProgressBar } from './ProgressBar';
import { ExitCode, TaskTree } from './TaskTree';
import { IndicationType, Theme } from './Theme';

let uid = 0;

export enum TaskStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Skipped = 3,
}

/** New subtask options */
export interface ITaskOptions {
  /** New subtask status */
  status?: TaskStatus;
  /** Removes all subtasks and progress bars after complete */
  autoClear?: boolean;
}

/** Entity for managing a task - includes all child objects (informational messages, errors, progress bars, and tasks) */
export class Task {
  #id: number;
  #text: string;
  #status: TaskStatus;
  #autoClear: boolean;
  #bars: ProgressBar[] = [];
  #subtasks: Task[] = [];
  #logs = new Set<string>();
  #errors: string[] = [];
  #warnings = new Set<string>();

  public constructor(text: string, { status, autoClear }: ITaskOptions = {}) {
    this.#id = ++uid;
    this.#text = text;
    this.#autoClear = !!autoClear;
    this.#status = status || TaskStatus.Pending;
  }

  get id(): number {
    return this.#id;
  }

  /** Text to display */
  get text(): string {
    return this.#text;
  }

  /** Current task status */
  get status(): TaskStatus {
    return this.#status;
  }

  /** First leaf subtask of the task tree, if it exists, otherwise, the object itself */
  get activeSubtask(): Task {
    const subtask = this.#subtasks[this.#subtasks.length - 1];
    let task = this as Task;

    if (subtask && subtask.isPending) task = subtask.activeSubtask;

    return task;
  }

  get isPending(): boolean {
    return this.status === TaskStatus.Pending;
  }

  get haveWarnings(): boolean {
    return !!this.#warnings.size || this.#subtasks.some((task): boolean => task.haveWarnings);
  }

  get haveErrors(): boolean {
    return !!this.#errors.length || this.#subtasks.some((task): boolean => task.haveErrors);
  }

  get havePendingSubtasks(): boolean {
    return !!this.#subtasks.filter((task): boolean => task.isPending).length;
  }

  get haveSubtasks(): boolean {
    return !!this.#subtasks.length;
  }

  public add(text: string, { status, autoClear }: ITaskOptions = {}): Task {
    const isCompleted = !this.isPending;
    const task = new Task(text, {
      status: isCompleted ? TaskStatus.Failed : status,
      autoClear,
    });

    this.#subtasks.push(task);

    if (isCompleted) this.fail(`Task is already complete, can't add new subtask [${task.#id}]`);

    return task;
  }

  /** Update task text */
  public update(text: string): Task {
    if (this.isPending) this.#text = text;

    return this;
  }

  /** Adds a new progress bar. Returns a progress bar object */
  public bar(template?: string, options?: IProgressBarOptions): ProgressBar {
    const bar = new ProgressBar(template, this.isPending ? options : { total: Progress.End });

    this.#bars.push(bar);

    if (!this.isPending) this.fail("Task is already complete, can't add new progress bar");

    return bar;
  }

  /** Removes all subtasks and progress bars */
  public clear(): void {
    this.#subtasks = [];
    this.#bars = [];
  }

  public complete(text?: string, clear = this.#autoClear): Task {
    if (this.havePendingSubtasks) this.fail('Subtasks is not complete.');

    this.setStatus(TaskStatus.Completed, text, clear);
    this.#bars = this.#bars.filter((bar): boolean => {
      bar.complete();

      return !bar.clear;
    });

    return this;
  }

  public skip(text?: string, clear = this.#autoClear): Task {
    this.setStatus(TaskStatus.Skipped, text, clear);

    return this;
  }

  public fail(error?: string | Error, clear = this.#autoClear): never {
    const text = error instanceof Error ? error.name : error;

    this.setStatus(TaskStatus.Failed, text, clear);

    return TaskTree.tree().exit(ExitCode.Error, error) as never;
  }

  public error(error?: string | Error, fail?: boolean): Task {
    if (typeof error === 'string') this.#errors.push(error);
    if (error instanceof Error && error.stack) this.#errors.push(error.stack);
    if (fail) this.fail(error);

    return this;
  }

  public log(text: string): Task {
    if (this.isPending) this.#logs.add(text);

    return this;
  }

  public warn(text: string): Task {
    if (this.isPending) this.#warnings.add(text);

    return this;
  }

  public render(theme: Theme, level = 0): string[] {
    const type = level ? IndicationType.Dim : IndicationType.Default;
    const rows = [
      theme.title(this, level),
      ...theme.bars(this.#bars, level + 1),
      ...theme.errors(this.#errors, level),
      ...theme.messages([...this.#warnings], IndicationType.Warning, level),
      ...theme.messages([...this.#logs], IndicationType.Info, level),
    ];

    this.#subtasks.forEach((task): void => {
      rows.push(...task.render(theme, level + 1));
    });

    return rows.map((row): string => theme.paint(row, type));
  }

  private setStatus(status: TaskStatus, text?: string, clear?: boolean): void {
    if (this.isPending) {
      if (text) this.#text = text;
      if (clear) this.clear();

      this.#status = status;
    } else {
      this.error(`Task is already complete (${chalk.bold(this.status.toString())})`);
      this.#status = TaskStatus.Failed;
    }
  }
}
