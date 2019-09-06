import { UpdateManager } from 'stdout-update';
import { Task } from './task';
import { Theme, ThemeOptions } from './theme';

export enum ExitCode {
    Success = 0,
    Error = 1,
}

export interface TaskTreeOptions {
    silent?: boolean;
    autoClear?: boolean;
}

export class TaskTree {
    public static TIMEOUT = 100;
    private static instance: TaskTree;

    private handle: NodeJS.Timeout | undefined;
    private tasks: Task[];
    private theme: Theme;
    private manager: UpdateManager;
    private silent = false;
    private autoClear = false;
    private started = false;
    private offset = 0;

    private constructor(theme?: ThemeOptions) {
        this.tasks = [];
        this.theme = new Theme(theme);
        this.manager = UpdateManager.getInstance();
    }

    public static tree(theme?: ThemeOptions): TaskTree {
        if (!TaskTree.instance) {
            TaskTree.instance = new TaskTree(theme);
        }

        return TaskTree.instance;
    }

    public static add(text: string): Task {
        return TaskTree.tree().add(text);
    }

    public static fail(error: string | Error, active = true): never {
        return TaskTree.tree().fail(error, active);
    }

    public start({ silent, autoClear }: TaskTreeOptions = {}): TaskTree {
        this.silent = !!silent;
        this.autoClear = !!autoClear;
        this.tasks = [];
        this.offset = 0;
        this.started = true;

        if (!this.handle && !this.silent) {
            this.manager.hook();
            this.handle = setInterval((): void => {
                this.log();
            }, TaskTree.TIMEOUT);
        }

        return this;
    }

    public stop(): TaskTree {
        this.started = false;

        if (this.handle) {
            clearInterval(this.handle);

            this.log();
            this.manager.unhook();
            this.handle = undefined;
        }

        return this;
    }

    public exit(code: ExitCode = ExitCode.Success, error?: string | Error): void | never {
        if (this.started) {
            this.stop();

            if (this.silent) {
                if (code === ExitCode.Error) throw error instanceof Error ? error : new Error(error);
            } else {
                process.exit(code);
            }
        } else if (code === ExitCode.Error) {
            throw error instanceof Error ? error : new Error(error);
        }
    }

    public add(text: string): Task {
        const { tasks } = this;
        let task = tasks[tasks.length - 1];

        if (task && task.isPending()) {
            task = task.getActive();
            task = task.add(text);
        } else {
            tasks.push((task = new Task(text, { autoClear: this.autoClear })));
        }

        return task;
    }

    public fail(error: string | Error, active = true): never {
        const errorObject = error instanceof Error ? error : new Error(error);

        if (!this.started || this.silent) {
            throw errorObject;
        } else {
            let task: Task = this.tasks[this.tasks.length - 1];

            task = active && task && task.isPending() ? task.getActive() : this.add(errorObject.name);

            return task.error(errorObject, true) as never;
        }
    }

    public render(): string[] {
        const { tasks } = this;
        let updatable = false;
        let rows: string[];
        let exclude = 0;

        const output = tasks.reduce<string[]>((acc, task): string[] => {
            rows = task.render(this.theme);
            updatable = updatable || task.isPending();

            if (!updatable) {
                this.offset += rows.length;
                exclude++;
            }

            return acc.concat(rows);
        }, []);

        if (exclude) this.tasks = tasks.slice(exclude);

        return output;
    }

    private log(): void {
        const position = this.offset;

        this.offset = 0;
        this.manager.update(this.render(), position);
    }
}
