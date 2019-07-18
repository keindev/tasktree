import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task } from '../src/task';
import { Status } from '../src/enums';
import { TaskTree } from '../src/tasktree';
import { Theme } from '../src/theme';

TaskTree.tree().start(true);

describe('Task', (): void => {
    it('Default', (): void => {
        const title = 'task';
        const status = Status.Completed;
        const task = new Task(title, status);

        expect(task.isPending()).toBeFalsy();
        expect(task.getText()).toBe(title);
        expect(task.getStatus()).toBe(status);
    });

    describe('Statuses', (): void => {
        it('Completed', (): void => {
            const title = 'complete';
            const task = new Task('task', Status.Pending).complete(title);

            expect(task.isPending()).toBeFalsy();
            expect(task.getText()).toBe(title);
            expect(task.getStatus()).toBe(Status.Completed);
        });

        it('Skipped', (): void => {
            const title = 'complete';
            const task = new Task('task', Status.Pending).skip(title);

            expect(task.isPending()).toBeFalsy();
            expect(task.getText()).toBe(title);
            expect(task.getStatus()).toBe(Status.Skipped);
        });

        it('Failed', (): void => {
            const title = 'complete';
            const task = new Task('task', Status.Pending).fail(title);

            expect(task.isPending()).toBeFalsy();
            expect(task.getText()).toBe(title);
            expect(task.getStatus()).toBe(Status.Failed);
        });

        it('Incorrect status changes', (): void => {
            [
                // Completed => Other
                new Task('completed', Status.Completed).complete(),
                new Task('completed', Status.Completed).skip(),
                new Task('completed', Status.Completed).fail(),
                // Skipped => Other
                new Task('skipped', Status.Skipped).complete(),
                new Task('skipped', Status.Skipped).skip(),
                new Task('skipped', Status.Skipped).fail(),
                // Failed => Other
                new Task('failed', Status.Failed).complete(),
                new Task('failed', Status.Failed).skip(),
                new Task('failed', Status.Failed).fail(),
            ].forEach((task): void => {
                expect(task.getStatus()).toBe(Status.Failed);
                expect(task.isPending()).toBeFalsy();
            });
        });
    });

    describe('Subtasks', (): void => {
        it('Add to Pending task', (): void => {
            const task = new Task('task', Status.Pending);

            expect(task.getActive()).toStrictEqual(task);
            expect(task.getActive().id()).toBe(task.id());

            const subtask = task.add('subtask');

            expect(subtask.isPending()).toBeTruthy();
            expect(task.getActive()).toStrictEqual(subtask);
        });

        it('Add to Completed task', (): void => {
            const task = new Task('task', Status.Completed);
            const subtask = task.add('subtask');

            expect(task.getStatus()).toBe(Status.Failed);
            expect(subtask.getStatus()).toBe(Status.Failed);
        });

        it('Clear subtask', (): void => {
            const task = new Task('task', Status.Pending);

            task.add('subtask', Status.Completed);
            task.bar().complete();
            task.complete().clear();

            expect(task.getStatus()).toBe(Status.Completed);
            expect(stripAnsi(task.render(new Theme()).join(Terminal.EOL))).toMatchSnapshot();
        });
    });

    it('Progress bar', (): void => {
        const task = new Task('task', Status.Pending);
        const tpl = ':bar :percent :etas';

        task.bar(tpl).complete();
        task.complete();

        expect(task.getStatus()).toBe(Status.Completed);
        expect(stripAnsi(task.render(new Theme()).join(Terminal.EOL))).toMatchSnapshot();
    });
});
