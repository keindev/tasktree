import chalk from 'chalk';
import { TaskTree } from './tasktree';
import { Theme } from './theme';
import * as Enums from './enums';
import { Progress } from './progress';
import { Options } from './types';

let uid = 0;

export class Task {
    private uid: number;
    private text: string;
    private status: Enums.Status;
    private bars: Progress[] = [];
    private subtasks: Task[] = [];
    private logs: Set<string> = new Set();
    private errors: string[] = [];
    private warnings: Set<string> = new Set();

    public constructor(text: string, status: Enums.Status = Enums.Status.Pending) {
        this.uid = ++uid;
        this.text = text;
        this.status = status;
    }

    public id(): number {
        return this.uid;
    }

    public getText(): string {
        return this.text;
    }

    public getStatus(): Enums.Status {
        return this.status;
    }

    public getActive(): Task {
        const { subtasks } = this;
        const subtask = subtasks[subtasks.length - 1];
        let task: Task = this;

        if (subtask && subtask.isPending()) task = subtask.getActive();

        return task;
    }

    public isPending(): boolean {
        return this.status === Enums.Status.Pending;
    }

    public havePendingSubtasks(): boolean {
        return !!this.subtasks.filter((task): boolean => task.isPending()).length;
    }

    public isList(): boolean {
        return !!this.subtasks.length;
    }

    public add(text: string, status: Enums.Status = Enums.Status.Pending): Task {
        const isCompleted = !this.isPending();
        const task = new Task(text, isCompleted ? Enums.Status.Failed : status);

        this.subtasks.push(task);

        if (isCompleted) this.fail(`Task is already complete, can't add new subtask [${task.id()}]`);

        return task;
    }

    public bar(template?: string, options?: Options): Progress {
        const isCompleted = !this.isPending();
        const bar = new Progress(template, isCompleted ? { total: Enums.Progress.End } : options);

        this.bars.push(bar);

        if (isCompleted) this.fail("Task is already complete, can't add new progress bar");

        return bar;
    }

    public complete(text?: string): Task {
        if (this.havePendingSubtasks()) this.fail('Subtasks is not complete.');

        this.update(Enums.Status.Completed, text);
        this.bars = this.bars.filter(
            (bar): boolean => {
                bar.complete();

                return !bar.clear;
            }
        );

        return this;
    }

    public skip(text?: string): Task {
        this.update(Enums.Status.Skipped, text);

        return this;
    }

    public fail(text?: string): Task {
        this.update(Enums.Status.Failed, text);

        TaskTree.tree().stop(false);

        return this;
    }

    public error(error?: string | Error, fail?: boolean): Task {
        const { errors } = this;

        if (typeof error === 'string') errors.push(error);
        if (error instanceof Error && error.stack) errors.push(error.stack);
        if (fail) this.fail();

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

    public render(theme: Theme, level = Enums.Level.Default): string {
        const text = [
            theme.title(this, level),
            ...theme.bars(this.bars, level),
            ...theme.errors(this.errors, level),
            ...theme.messages([...this.warnings], Enums.Type.Warning, level),
            ...theme.messages([...this.logs], Enums.Type.Info, level),
            ...this.subtasks.map((task: Task): string => task.render(theme, level + Enums.Level.Step)),
        ].join(Theme.DELIMITER);

        return theme.paint(text, level ? Enums.Type.Dim : Enums.Type.Default);
    }

    private update(status: Enums.Status, text?: string): void {
        if (this.isPending()) {
            if (text) this.text = text;

            this.status = status;
        } else {
            this.error(`Task is already complete (${chalk.bold(this.status.toString())})`);
            this.status = Enums.Status.Failed;
        }
    }
}
