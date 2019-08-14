import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task } from '../src/task';
import { TaskTree } from '../src/tasktree';
import { Theme } from '../src/theme';
import { Status } from '../src/enums';

describe('TaskTree', (): void => {
    const $tree = TaskTree.tree();
    const $theme = new Theme();
    const $renderTree = (): string => stripAnsi($tree.render().join(Terminal.EOL));
    const $renderTask = (task: Task): string => stripAnsi(task.render($theme).join(Terminal.EOL));

    beforeEach((): void => {
        $tree.start(true);
    });

    afterEach((): void => {
        $tree.stop();
    });

    describe('Static', (): void => {
        it('Add', (): void => {
            TaskTree.add('task').complete();

            expect($renderTree()).toMatchSnapshot();
        });

        it('Fail', (): void => {
            try {
                TaskTree.fail('error');
            } catch (err) {
                expect($renderTree()).toMatchSnapshot();
            }

            try {
                TaskTree.fail(new Error('Error message'));
            } catch (err) {
                expect($renderTree()).toMatchSnapshot();
            }
        });
    });

    it('Default', (): void => {
        expect($tree).toBeDefined();
    });

    describe('Manage tasks', (): void => {
        let $task: Task;

        beforeEach((): void => {
            $task = $tree.add('task');
            $task.log(`message`).warn(`warning`);
        });

        it('Skip', (): void => {
            expect($renderTask($task.skip())).toMatchSnapshot();
        });

        it('Fail with string', (): void => {
            try {
                $tree.fail('Something bad happened\nat X\nat Y\nat Z');
            } catch (err) {
                expect($renderTask($task)).toMatchSnapshot();
            }
        });

        it('Fail with new Error()', (): void => {
            try {
                $tree.fail(new Error('Something bad happened\nat X\nat Y\nat Z'));
            } catch (err) {
                expect($task.haveErrors()).toBeTruthy();
                expect($task.getStatus()).toBe(Status.Failed);
            }
        });

        it('Complete', (): void => {
            expect($renderTask($task.complete())).toMatchSnapshot();
        });

        it('Render', (): void => {
            expect($renderTree()).toMatchSnapshot();

            $tree.stop();

            expect($renderTree()).toMatchSnapshot();

            $tree.start(true);
            $tree.stop();

            expect($renderTree()).toMatchSnapshot();
        });
    });

    it('Manage tasks with static methods', (): void => {
        try {
            $tree.start(true);
            $tree.add('task');
            $tree.fail('error message');
        } catch (err) {
            expect($renderTree()).toMatchSnapshot();
            expect((err as Error).message).toBe('error message');

            $tree.stop();
        }

        try {
            $tree.start(true);
            $tree.add('task');
            $tree.fail('error message', false);
        } catch (err) {
            expect($renderTree()).toMatchSnapshot();
            expect((err as Error).message).toBe('error message');

            $tree.stop();
        }
    });
});
