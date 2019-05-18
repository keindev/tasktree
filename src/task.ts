import chalk from 'chalk';
import { TaskTree } from './tasktree';
import { Template } from './template';
import { Status, Type } from './enums';

let uid = 0;

export class Task {
    private uid: number;
    private text: string;
    private status: Status;
    private subtasks: Task[] = [];
    private logs: Set<string> = new Set();
    private errors: string[] = [];
    private warnings: Set<string> = new Set();

    public constructor(text: string, status: Status = Status.Pending) {
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

    public getStatus(): Status {
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
        return this.status === Status.Pending;
    }

    public isList(): boolean {
        return !!this.subtasks.length;
    }

    public add(text: string, status: Status = Status.Pending): Task {
        const isCompleted = !this.isPending();
        const task = new Task(text, isCompleted ? Status.Failed : status);

        this.subtasks.push(task);

        if (isCompleted) this.fail(`Task is already complete, can't add new subtask [${task.id()}]`);

        return task;
    }

    public complete(text?: string): Task {
        if (!this.subtasks.filter((task): boolean => task.isPending()).length) {
            this.update(Status.Completed, text);
        } else {
            this.fail('Subtasks is not complete.');
        }

        return this;
    }

    public skip(text?: string): Task {
        this.update(Status.Skipped, text);

        return this;
    }

    public fail(text?: string): Task {
        this.update(Status.Failed, text);

        TaskTree.tree().stop(false);

        return this;
    }

    public error(error?: string | Error): Task {
        const { errors } = this;

        if (typeof error === 'string') errors.push(error);
        if (error instanceof Error && error.stack) errors.push(error.stack);

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

    public render(template: Template, level = 0): string {
        const text = [
            template.title(this, level),
            ...template.errors(this.errors, level),
            ...template.messages([...this.warnings], Type.Warning, level + 1),
            ...template.messages([...this.logs], Type.Info, level + 1),
            ...this.subtasks.map((task: Task): string => task.render(template, level + 1)),
        ].join(Template.DELIMITER);

        return template.paint(text, level ? Type.Dim : Type.Default);
    }

    private update(status: Status, text?: string): void {
        if (this.isPending()) {
            if (text) this.text = text;

            this.status = status;
        } else {
            this.error(`Task is already complete (${chalk.bold(this.status.toString())})`);
            this.status = Status.Failed;
        }
    }
}
