import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task } from '../Task';
import { TaskTree, ITaskTreeOptions } from '../TaskTree';
import { Theme } from '../Theme';

const tree = TaskTree.tree();
const options: ITaskTreeOptions = { silent: true, autoClear: false };
const theme = new Theme();
const renderTree = (): string => stripAnsi(tree.render().join(Terminal.EOL));
const renderTask = (task: Task): string => stripAnsi(task.render(theme).join(Terminal.EOL));
let task: Task;

describe('TaskTree', (): void => {
    beforeEach((): void => {
        tree.start(options);
    });

    afterEach((): void => {
        tree.stop();
    });

    describe('Static', (): void => {
        it('Add', (): void => {
            TaskTree.add('task').complete();

            expect(renderTree()).toMatchSnapshot();
        });

        it('Fail', (): void => {
            try {
                tree.start(options);
                tree.fail('error message 1');
            } catch (error) {
                // eslint-disable-next-line jest/no-try-expect
                expect((error as Error).message).toBe('error message 1');

                tree.stop();
            }

            try {
                tree.start(options);
                tree.fail(new Error('error message 2'));
            } catch (error) {
                // eslint-disable-next-line jest/no-try-expect
                expect((error as Error).message).toBe('error message 2');

                tree.stop();
            }
        });
    });

    it('Default', (): void => {
        expect(tree).toBeDefined();
    });

    describe('Manage tasks', (): void => {
        beforeEach((): void => {
            task = tree.add('task');
            task.log(`message`).warn(`warning`);
        });

        it('Skip', (): void => {
            expect(renderTask(task.skip())).toMatchSnapshot();
        });

        it('Fail with string', (): void => {
            try {
                tree.fail('Something bad happened\nat X\nat Y\nat Z');
            } catch (error) {
                // eslint-disable-next-line jest/no-try-expect
                expect((error as Error).message).toBe('Something bad happened\nat X\nat Y\nat Z');
            }
        });

        it('Fail with new Error()', (): void => {
            try {
                tree.fail(new Error('Something bad happened\nat X\nat Y\nat Z'));
            } catch (error) {
                // eslint-disable-next-line jest/no-try-expect
                expect((error as Error).message).toBe('Something bad happened\nat X\nat Y\nat Z');
            }
        });

        it('Complete and render', (): void => {
            const output = renderTask(task.complete());

            expect(output).toBeTruthy();
            expect(output).toBe(renderTree());

            tree.stop();

            expect(renderTree()).toBe('');

            tree.start(options);
            tree.stop();

            expect(renderTree()).toBe('');
        });
    });
});
