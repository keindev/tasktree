import { UpdateManager } from 'stdout-update';
import { Task } from './task';
import * as Types from './types';
import { Theme } from './theme';
import { ExitCode } from './enums';

export class TaskTree {
    public static TIMEOUT = 100;
    private static instance: TaskTree;

    private handle: NodeJS.Timeout | undefined;
    private tasks: Task[];
    private theme: Theme;
    private manager: UpdateManager;
    private silence: boolean = false;

    private constructor(theme?: Types.Theme) {
        this.tasks = [];
        this.theme = new Theme(theme);
        this.manager = UpdateManager.getInstance();
    }

    public static tree(theme?: Types.Theme): TaskTree {
        if (!TaskTree.instance) {
            TaskTree.instance = new TaskTree(theme);
        }

        return TaskTree.instance;
    }

    public start(silence?: boolean): TaskTree {
        this.silence = !!silence;
        this.tasks = [];

        if (!this.handle && !this.silence) {
            this.manager.hook();
            this.handle = setInterval((): void => {
                this.log();
            }, TaskTree.TIMEOUT);
        }

        return this;
    }

    public stop(): TaskTree {
        if (this.handle) {
            clearInterval(this.handle);

            this.log();
            this.manager.unhook();
            this.handle = undefined;
        }

        return this;
    }

    public exit(code: ExitCode = ExitCode.Success): void {
        if (!this.silence) {
            this.stop();
            process.exit(code);
        }
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

    public render(): string[] {
        return this.tasks.reduce<string[]>((acc, task): string[] => acc.concat(task.render(this.theme)), []);
        // return this.tasks.map((task): string[] => task.render(this.theme)).flat();
    }

    private log(): void {
        this.manager.update(this.render());
    }
}
