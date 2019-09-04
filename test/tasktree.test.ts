import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task } from '../src/entities/task';
import { TaskTree } from '../src/tasktree';
import { Theme } from '../src/theme';

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
                $tree.start(true);
                $tree.fail('error message 1');
            } catch (error) {
                expect((error as Error).message).toBe('error message 1');

                $tree.stop();
            }

            try {
                $tree.start(true);
                $tree.fail(new Error('error message 2'));
            } catch (error) {
                expect((error as Error).message).toBe('error message 2');

                $tree.stop();
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
            } catch (error) {
                expect((error as Error).message).toBe('Something bad happened\nat X\nat Y\nat Z');
            }
        });

        it('Fail with new Error()', (): void => {
            try {
                $tree.fail(new Error('Something bad happened\nat X\nat Y\nat Z'));
            } catch (error) {
                expect((error as Error).message).toBe('Something bad happened\nat X\nat Y\nat Z');
            }
        });

        it('Complete and render', (): void => {
            const output = $renderTask($task.complete());

            expect(output).toBeTruthy();
            expect(output).toBe($renderTree());

            $tree.stop();

            expect($renderTree()).toBe('');

            $tree.start(true);
            $tree.stop();

            expect($renderTree()).toBe('');
        });
    });
});
