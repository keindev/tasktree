import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task, TaskStatus } from '../../src/entities/task';
import { TaskTree } from '../../src/tasktree';
import { Theme } from '../../src/theme';

describe('Task', (): void => {
    const $title = 'task';

    beforeAll((): void => {
        TaskTree.tree().start(true);
    });

    it('Default', (): void => {
        const task = new Task($title, TaskStatus.Completed);

        expect(task.isPending()).toBeFalsy();
        expect(task.getText()).toBe($title);
        expect(task.getStatus()).toBe(TaskStatus.Completed);
    });

    it('Update', (): void => {
        const task = new Task($title, TaskStatus.Completed).update('new title');

        expect(task.getText()).toBe('new title');
    });

    it('Check for errors or warnings in the task', (): void => {
        const task = new Task($title, TaskStatus.Pending);
        const subtask = task.add($title, TaskStatus.Pending);

        subtask.warn('warning');
        subtask.error('error');

        expect(task.haveWarnings()).toBeTruthy();
        expect(task.haveErrors()).toBeTruthy();
    });

    describe('Correct status changing', (): void => {
        let $task: Task;

        beforeEach((): void => {
            $task = new Task('pending task', TaskStatus.Pending);
        });

        afterEach((): void => {
            expect($task.isPending()).toBeFalsy();
            expect($task.getText()).toBe($title);
        });

        it('Completed', (): void => {
            $task.complete($title);

            expect($task.getStatus()).toBe(TaskStatus.Completed);
        });

        it('Skipped', (): void => {
            $task.skip($title);

            expect($task.getStatus()).toBe(TaskStatus.Skipped);
        });

        it('Failed', (): void => {
            try {
                $task.fail($title);
            } catch {
                expect($task.getStatus()).toBe(TaskStatus.Failed);
            }
        });
    });

    describe('Incorrect status changes', (): void => {
        let $tasks: Task[];

        beforeEach((): void => {
            $tasks = [
                new Task($title, TaskStatus.Completed),
                new Task($title, TaskStatus.Skipped),
                new Task($title, TaskStatus.Failed),
            ];
        });

        it('Complete', (): void => {
            $tasks.forEach((task): void => {
                try {
                    task.complete();
                } catch {
                    expect(task.getStatus()).toBe(TaskStatus.Failed);
                    expect(task.isPending()).toBeFalsy();
                }
            });
        });

        it('Skip', (): void => {
            $tasks.forEach((task): void => {
                try {
                    task.skip();
                } catch {
                    expect(task.getStatus()).toBe(TaskStatus.Failed);
                    expect(task.isPending()).toBeFalsy();
                }
            });
        });

        it('Fail', (): void => {
            $tasks.forEach((task): void => {
                try {
                    task.fail();
                } catch {
                    expect(task.getStatus()).toBe(TaskStatus.Failed);
                    expect(task.isPending()).toBeFalsy();
                }
            });
        });
    });

    describe('Subtasks', (): void => {
        it('Add to Pending task', (): void => {
            const task = new Task($title, TaskStatus.Pending);

            expect(task.getActive()).toStrictEqual(task);
            expect(task.getActive().id()).toBe(task.id());

            const subtask = task.add($title);

            expect(subtask.isPending()).toBeTruthy();
            expect(task.getActive()).toStrictEqual(subtask);
        });

        it('Add to Completed task', (): void => {
            const task = new Task($title, TaskStatus.Completed);
            let subtask: Task | undefined;

            try {
                subtask = task.add($title);
            } catch {
                expect(subtask).toBeUndefined();
                expect(task.getStatus()).toBe(TaskStatus.Failed);
            }
        });

        it('Clear subtask', (): void => {
            const task = new Task($title, TaskStatus.Pending);

            task.add($title, TaskStatus.Completed);
            task.bar().complete();
            task.complete().clear();

            expect(task.getStatus()).toBe(TaskStatus.Completed);
            expect(stripAnsi(task.render(new Theme()).join(Terminal.EOL))).toMatchSnapshot();
        });
    });

    it('Progress bar', (): void => {
        const task = new Task($title, TaskStatus.Pending);

        task.bar(':bar :percent :etas').complete();
        task.complete();

        expect(task.getStatus()).toBe(TaskStatus.Completed);
        expect(stripAnsi(task.render(new Theme()).join(Terminal.EOL))).toMatchSnapshot();
    });
});
