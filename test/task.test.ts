import stripAnsi from 'strip-ansi';
import { Task } from '../src/task';
import { Status } from '../src/enums';
import { TaskTree } from '../src/tasktree';
import { Theme } from '../src/theme';

TaskTree.tree().start(true);

describe('Task', (): void => {
    it('Create', (): void => {
        const title = 'task';
        const status = Status.Completed;
        const task = new Task(title, status);

        expect(task.isPending()).toBeFalsy();
        expect(task.getText()).toBe(title);
        expect(task.getStatus()).toBe(status);
    });

    describe('Statuses', (): void => {
        it('Pending -> Completed', (): void => {
            const title = 'complete';
            const task = new Task('task', Status.Pending).complete(title);

            expect(task.isPending()).toBeFalsy();
            expect(task.getText()).toBe(title);
            expect(task.getStatus()).toBe(Status.Completed);
        });

        it('Pending -> Skipped', (): void => {
            const title = 'complete';
            const task = new Task('task', Status.Pending).skip(title);

            expect(task.isPending()).toBeFalsy();
            expect(task.getText()).toBe(title);
            expect(task.getStatus()).toBe(Status.Skipped);
        });

        it('Pending -> Failed', (): void => {
            const title = 'complete';
            const task = new Task('task', Status.Pending).fail(title);

            expect(task.isPending()).toBeFalsy();
            expect(task.getText()).toBe(title);
            expect(task.getStatus()).toBe(Status.Failed);
        });

        it('Completed x Other', (): void => {
            const title = 'complete';
            const tasks = [
                // Completed => Other
                new Task(title, Status.Completed).complete(),
                new Task(title, Status.Completed).skip(),
                new Task(title, Status.Completed).fail(),
                // Skipped => Other
                new Task(title, Status.Skipped).complete(),
                new Task(title, Status.Skipped).skip(),
                new Task(title, Status.Skipped).fail(),
                // Failed => Other
                new Task(title, Status.Failed).complete(),
                new Task(title, Status.Failed).skip(),
                new Task(title, Status.Failed).fail(),
            ];

            expect(
                tasks.every(
                    (task): boolean => {
                        expect(task.getText()).toBe(title);
                        expect(task.getStatus()).toBe(Status.Failed);

                        return !task.isPending();
                    }
                )
            ).toBeTruthy();
        });
    });

    describe('Subtasks', (): void => {
        it('Add to Pending task', (): void => {
            const title = 'subtask';
            const task = new Task(title, Status.Pending);

            expect(task.getActive()).toBeInstanceOf(Task);
            expect(task.getActive().id()).toBe(task.id());

            const subtask = task.add(title);

            expect(subtask).toBeInstanceOf(Task);
            expect(subtask.isPending()).toBeTruthy();
            expect(task.getActive()).toBeInstanceOf(Task);
            expect(task.getActive().id()).toBe(subtask.id());
        });

        it('Add to Completed task', (): void => {
            const title = 'subtask';
            const task = new Task(title, Status.Completed);
            const subtask = task.add(title);

            expect(subtask).toBeInstanceOf(Task);
            expect(task.getStatus()).toBe(Status.Failed);
            expect(subtask.getStatus()).toBe(Status.Failed);
        });

        it('Clear subtask', (): void => {
            const title = 'subtask';
            const task = new Task(title, Status.Pending);
            const theme = new Theme();

            task.add(title, Status.Completed);
            expect(task.getStatus()).toBe(Status.Pending);

            task.bar().complete();
            expect(task.getStatus()).toBe(Status.Pending);

            task.complete().clear();
            expect(task.getStatus()).toBe(Status.Completed);
            expect(stripAnsi(task.render(theme))).toMatchSnapshot();
        });
    });

    it('Progress bar', (): void => {
        const title = 'subtask';
        const task = new Task(title, Status.Pending);
        const tpl = ':bar :percent :etas';
        const theme = new Theme();

        task.bar(tpl).complete();
        expect(task.getStatus()).toBe(Status.Pending);

        task.complete();
        expect(task.getStatus()).toBe(Status.Completed);
        expect(stripAnsi(task.render(theme))).toMatchSnapshot();
    });
});
