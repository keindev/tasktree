import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task, TaskStatus } from '../Task';
import { TaskTree } from '../TaskTree';
import { Theme, ThemeOptions } from '../Theme';
import { IProgressBarOptions } from '../ProgressBar';

const title = 'task';
const themeOptions: ThemeOptions = { success: { symbol: '+' }, subtask: { symbol: '--' } };
const progressBarOptions: IProgressBarOptions = { complete: '*', incomplete: '_' };

describe('Task', (): void => {
    beforeAll((): void => {
        TaskTree.tree().start({ silent: true });
    });

    it('Default', (): void => {
        const task = new Task(title).complete();

        expect(task.isPending()).toBeFalsy();
        expect(task.getText()).toBe(title);
        expect(task.getStatus()).toBe(TaskStatus.Completed);
    });

    it('Update', (): void => {
        const task = new Task(title).update('new title');

        expect(task.getText()).toBe('new title');
    });

    it('Check for errors or warnings in the task', (): void => {
        const task = new Task(title);
        const subtask = task.add(title);

        subtask.warn('warning');
        subtask.error('error');

        expect(task.haveWarnings()).toBeTruthy();
        expect(task.haveErrors()).toBeTruthy();
    });

    describe('Correct status changing', (): void => {
        let task: Task;

        beforeEach((): void => {
            task = new Task('pending task');
        });

        it('Completed', (): void => {
            task.complete(title);

            expect(task.getStatus()).toBe(TaskStatus.Completed);
            expect(task.isPending()).toBeFalsy();
            expect(task.getText()).toBe(title);
        });

        it('Skipped', (): void => {
            task.skip(title);

            expect(task.getStatus()).toBe(TaskStatus.Skipped);
            expect(task.isPending()).toBeFalsy();
            expect(task.getText()).toBe(title);
        });

        it('Failed', (): void => {
            try {
                task.fail(title);
            } catch {
                // eslint-disable-next-line jest/no-try-expect
                expect(task.getStatus()).toBe(TaskStatus.Failed);
                // eslint-disable-next-line jest/no-try-expect
                expect(task.isPending()).toBeFalsy();
                // eslint-disable-next-line jest/no-try-expect
                expect(task.getText()).toBe(title);
            }
        });
    });

    describe('Incorrect status changes', (): void => {
        let tasks: Task[];

        beforeEach((): void => {
            tasks = [
                new Task(title, { status: TaskStatus.Completed }),
                new Task(title, { status: TaskStatus.Skipped }),
                new Task(title, { status: TaskStatus.Failed }),
            ];
        });

        it('Complete', (): void => {
            tasks.forEach((item): void => {
                try {
                    item.complete();
                } catch {
                    // eslint-disable-next-line jest/no-try-expect
                    expect(item.getStatus()).toBe(TaskStatus.Failed);
                    // eslint-disable-next-line jest/no-try-expect
                    expect(item.isPending()).toBeFalsy();
                }
            });
        });

        it('Skip', (): void => {
            tasks.forEach((item): void => {
                try {
                    item.skip();
                } catch {
                    // eslint-disable-next-line jest/no-try-expect
                    expect(item.getStatus()).toBe(TaskStatus.Failed);
                    // eslint-disable-next-line jest/no-try-expect
                    expect(item.isPending()).toBeFalsy();
                }
            });
        });

        it('Fail', (): void => {
            tasks.forEach((item): void => {
                try {
                    item.fail();
                } catch {
                    // eslint-disable-next-line jest/no-try-expect
                    expect(item.getStatus()).toBe(TaskStatus.Failed);
                    // eslint-disable-next-line jest/no-try-expect
                    expect(item.isPending()).toBeFalsy();
                }
            });
        });
    });

    describe('Subtasks', (): void => {
        it('Add to Pending task', (): void => {
            const task = new Task(title);

            expect(task.getActive()).toStrictEqual(task);
            expect(task.getActive().id()).toBe(task.id());

            const subtask = task.add(title);

            expect(subtask.isPending()).toBeTruthy();
            expect(task.getActive()).toStrictEqual(subtask);
        });

        it('Add to Completed task', (): void => {
            const task = new Task(title).complete();
            let subtask: Task | undefined;

            try {
                subtask = task.add(title);
            } catch {
                // eslint-disable-next-line jest/no-try-expect
                expect(subtask).toBeUndefined();
                // eslint-disable-next-line jest/no-try-expect
                expect(task.getStatus()).toBe(TaskStatus.Failed);
            }
        });

        it('Clear subtask', (): void => {
            const task = new Task(title);

            task.add(title).complete();
            task.bar().complete();
            task.complete().clear();

            expect(task.getStatus()).toBe(TaskStatus.Completed);
            expect(stripAnsi(task.render(new Theme(themeOptions)).join(Terminal.EOL))).toMatchSnapshot();
        });
    });

    it('Progress bar', (): void => {
        const task = new Task(title);

        task.bar(':bar :percent :etas', progressBarOptions).complete();
        task.complete();

        expect(task.getStatus()).toBe(TaskStatus.Completed);
        expect(stripAnsi(task.render(new Theme(themeOptions)).join(Terminal.EOL))).toMatchSnapshot();
    });
});
