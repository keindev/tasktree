import logUpdate from 'log-update';
import Task from './task';

export default class TaskTree {
    private static instance: TaskTree;

    private id: NodeJS.Timeout | undefined;
    private tasks: Task[] = [];

    public static tree(): TaskTree {
        if (!TaskTree.instance) {
            TaskTree.instance = new TaskTree();
        }

        return TaskTree.instance;
    }

    public start(): void {
        if (!this.id) {
            this.id = setInterval((): void => {
                this.render();
            }, 100);
        }
    }

    public stop(success: boolean): void {
        if (this.id) {
            clearInterval(this.id);

            this.id = undefined;
            this.render();
            logUpdate.done();
        }

        process.exit(Number(success));
    }

    public task(text: string): Task {
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

    private render(): void {
        logUpdate(this.tasks.map((task): string => task.render()).join('\n'));
    }
}
