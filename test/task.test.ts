import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task } from '../src/task';
import { Status } from '../src/enums';
import { TaskTree } from '../src/tasktree';
import { Theme } from '../src/theme';

describe('Task', (): void => {
    const $title = 'task';

    beforeAll((): void => {
        TaskTree.tree().start(true);
    });

    it('Default', (): void => {
        const task = new Task($title, Status.Completed);

        expect(task.isPending()).toBeFalsy();
        expect(task.getText()).toBe($title);
        expect(task.getStatus()).toBe(Status.Completed);
    });

    it('Update', (): void => {
        const task = new Task($title, Status.Completed).update('new title');

        expect(task.getText()).toBe('new title');
    });

    describe('Correct status changing', (): void => {
        let $task: Task;

        beforeEach((): void => {
            $task = new Task('pending task', Status.Pending);
        });

        afterEach((): void => {
            expect($task.isPending()).toBeFalsy();
            expect($task.getText()).toBe($title);
        });

        it('Completed', (): void => {
            $task.complete($title);

            expect($task.getStatus()).toBe(Status.Completed);
        });

        it('Skipped', (): void => {
            $task.skip($title);

            expect($task.getStatus()).toBe(Status.Skipped);
        });

        it('Failed', (): void => {
            try {
                $task.fail($title);
            } catch {
                expect($task.getStatus()).toBe(Status.Failed);
            }
        });
    });

    describe('Incorrect status changes', (): void => {
        let $tasks: Task[];

        beforeEach((): void => {
            $tasks = [
                new Task($title, Status.Completed),
                new Task($title, Status.Skipped),
                new Task($title, Status.Failed),
            ];
        });

        it('Complete', (): void => {
            $tasks.forEach((task): void => {
                try {
                    task.complete();
                } catch {
                    expect(task.getStatus()).toBe(Status.Failed);
                    expect(task.isPending()).toBeFalsy();
                }
            });
        });

        it('Skip', (): void => {
            $tasks.forEach((task): void => {
                try {
                    task.skip();
                } catch {
                    expect(task.getStatus()).toBe(Status.Failed);
                    expect(task.isPending()).toBeFalsy();
                }
            });
        });

        it('Fail', (): void => {
            $tasks.forEach((task): void => {
                try {
                    task.fail();
                } catch {
                    expect(task.getStatus()).toBe(Status.Failed);
                    expect(task.isPending()).toBeFalsy();
                }
            });
        });
    });

    describe('Subtasks', (): void => {
        it('Add to Pending task', (): void => {
            const task = new Task($title, Status.Pending);

            expect(task.getActive()).toStrictEqual(task);
            expect(task.getActive().id()).toBe(task.id());

            const subtask = task.add($title);

            expect(subtask.isPending()).toBeTruthy();
            expect(task.getActive()).toStrictEqual(subtask);
        });

        it('Add to Completed task', (): void => {
            const task = new Task($title, Status.Completed);
            let subtask: Task | undefined;

            try {
                subtask = task.add($title);
            } catch {
                expect(subtask).toBeUndefined();
                expect(task.getStatus()).toBe(Status.Failed);
            }
        });

        it('Clear subtask', (): void => {
            const task = new Task($title, Status.Pending);

            task.add($title, Status.Completed);
            task.bar().complete();
            task.complete().clear();

            expect(task.getStatus()).toBe(Status.Completed);
            expect(stripAnsi(task.render(new Theme()).join(Terminal.EOL))).toMatchSnapshot();
        });
    });

    it('Progress bar', (): void => {
        const task = new Task($title, Status.Pending);

        task.bar(':bar :percent :etas').complete();
        task.complete();

        expect(task.getStatus()).toBe(Status.Completed);
        expect(stripAnsi(task.render(new Theme()).join(Terminal.EOL))).toMatchSnapshot();
    });
});
