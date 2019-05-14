import logUpdate from 'log-update';
import Task from './task';

export default class TaskTree {
    private static instance: TaskTree;

    private id: NodeJS.Timeout | undefined;
    private tasks: Task[] = [];
    private silence = false;

    public static tree(): TaskTree {
        if (!TaskTree.instance) {
            TaskTree.instance = new TaskTree();
        }

        return TaskTree.instance;
    }

    public start(silence?: boolean): void {
        this.silence = !!silence;
        this.tasks = [];

        if (!this.id) {
            this.id = setInterval((): void => {
                this.log();
            }, 100);
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
        return this.tasks.map((task): string => task.render()).join('\n');
    }

    private log(): void {
        logUpdate(this.render());
    }
}
