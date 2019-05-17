import logUpdate from 'log-update';
import { Task } from './task';
import { Theme } from './types';
import { Template } from './template';

export class TaskTree {
    public static TIMEOUT = 100;
    private static instance: TaskTree;

    private id: NodeJS.Timeout | undefined;
    private tasks: Task[];
    private template: Template;
    private silence: boolean = false;

    private constructor(theme?: Theme) {
        this.tasks = [];
        this.template = new Template(theme);
    }

    public static tree(theme?: Theme): TaskTree {
        if (!TaskTree.instance) {
            TaskTree.instance = new TaskTree(theme);
        }

        return TaskTree.instance;
    }

    public start(silence?: boolean): void {
        this.silence = !!silence;
        this.tasks = [];

        if (!this.id) {
            this.id = setInterval((): void => {
                this.log();
            }, TaskTree.TIMEOUT);
        }
    }

    public stop(success: boolean): void {
        if (this.id) {
            clearInterval(this.id);

            this.log();
            logUpdate.done();
            this.id = undefined;
        }

        if (!this.silence) process.exit(Number(success));
    }

    public add(text: string): Task {
        const { tasks } = this;
        let task = tasks[tasks.length - 1];

        if (task && task.isPending()) {
            task = task.getActive();
            task = task.add(text);
        } else {
            tasks.push((task = new Task(text)));
        }

        return task;
    }

    public render(): string {
        return this.tasks.map((task): string => task.render(this.template)).join('\n');
    }

    private log(): void {
        logUpdate(this.render());
    }
}
