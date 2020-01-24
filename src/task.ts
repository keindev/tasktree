import chalk from 'chalk';
import { TaskTree, ExitCode } from './tasktree';
import { Theme, IndicationType } from './theme';
import { ProgressBar, ProgressBarOptions, Progress } from './progress-bar';

let uid = 0;

export enum TaskStatus {
    Pending = 0,
    Completed = 1,
    Failed = 2,
    Skipped = 3,
}

export interface TaskOptions {
    status?: TaskStatus;
    autoClear?: boolean;
}

export class Task {
    private uid: number;
    private text: string;
    private status: TaskStatus;
    private autoClear: boolean;
    private bars: ProgressBar[] = [];
    private subtasks: Task[] = [];
    private logs: Set<string> = new Set();
    private errors: string[] = [];
    private warnings: Set<string> = new Set();

    public constructor(text: string, { status, autoClear }: TaskOptions = {}) {
        this.uid = ++uid;
        this.text = text;
        this.autoClear = !!autoClear;
        this.status = status || TaskStatus.Pending;
    }

    public id(): number {
        return this.uid;
    }

    public getText(): string {
        return this.text;
    }

    public getStatus(): TaskStatus {
        return this.status;
    }

    public getActive(): Task {
        const { subtasks } = this;
        const subtask = subtasks[subtasks.length - 1];
        let task = this as Task;

        if (subtask && subtask.isPending()) task = subtask.getActive();

        return task;
    }

    public isPending(): boolean {
        return this.status === TaskStatus.Pending;
    }

    public haveWarnings(): boolean {
        return !!this.warnings.size || this.subtasks.some((task): boolean => task.haveWarnings());
    }

    public haveErrors(): boolean {
        return !!this.errors.length || this.subtasks.some((task): boolean => task.haveErrors());
    }

    public havePendingSubtasks(): boolean {
        return !!this.subtasks.filter((task): boolean => task.isPending()).length;
    }

    public haveSubtasks(): boolean {
        return !!this.subtasks.length;
    }

    public add(text: string, { status, autoClear }: TaskOptions = {}): Task {
        const isCompleted = !this.isPending();
        const task = new Task(text, {
            status: isCompleted ? TaskStatus.Failed : status,
            autoClear,
        });

        this.subtasks.push(task);

        if (isCompleted) this.fail(`Task is already complete, can't add new subtask [${task.id()}]`);

        return task;
    }

    public update(text: string): Task {
        if (this.isPending()) this.text = text;

        return this;
    }

    public bar(template?: string, options?: ProgressBarOptions): ProgressBar {
        const isCompleted = !this.isPending();
        const bar = new ProgressBar(template, isCompleted ? { total: Progress.End } : options);

        this.bars.push(bar);

        if (isCompleted) this.fail("Task is already complete, can't add new progress bar");

        return bar;
    }

    public clear(): void {
        this.subtasks = [];
        this.bars = [];
    }

    public complete(text?: string, clear = this.autoClear, status = TaskStatus.Completed): Task {
        if (this.havePendingSubtasks()) this.fail('Subtasks is not complete.');

        this.setStatus(status, text, clear);
        this.bars = this.bars.filter((bar): boolean => {
            bar.complete();

            return !bar.clear;
        });

        return this;
    }

    public skip(text?: string, clear = this.autoClear): Task {
        this.setStatus(TaskStatus.Skipped, text, clear);

        return this;
    }

    public fail(error?: string | Error, clear = this.autoClear): never {
        const text = error instanceof Error ? error.name : error;

        this.setStatus(TaskStatus.Failed, text, clear);

        return TaskTree.tree().exit(ExitCode.Error, error) as never;
    }

    public error(error?: string | Error, fail?: boolean): Task {
        const { errors } = this;

        if (typeof error === 'string') errors.push(error);
        if (error instanceof Error && error.stack) errors.push(error.stack);
        if (fail) this.fail(error);

        return this;
    }

    public log(text: string): Task {
        if (this.isPending()) this.logs.add(text);

        return this;
    }

    public warn(text: string): Task {
        if (this.isPending()) this.warnings.add(text);

        return this;
    }

    public render(theme: Theme, level = 0): string[] {
        const type = level ? IndicationType.Dim : IndicationType.Default;
        const rows = [
            theme.title(this, level),
            ...theme.bars(this.bars, level + 1),
            ...theme.errors(this.errors, level),
            ...theme.messages([...this.warnings], IndicationType.Warning, level),
            ...theme.messages([...this.logs], IndicationType.Info, level),
        ];

        this.subtasks.forEach((task): void => {
            rows.push(...task.render(theme, level + 1));
        });

        return rows.map((row): string => theme.paint(row, type));
    }

    private setStatus(status: TaskStatus, text?: string, clear?: boolean): void {
        if (this.isPending()) {
            if (text) this.text = text;
            if (clear) this.clear();

            this.status = status;
        } else {
            this.error(`Task is already complete (${chalk.bold(this.status.toString())})`);
            this.status = TaskStatus.Failed;
        }
    }
}
