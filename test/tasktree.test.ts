import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task } from '../src/task';
import { TaskTree } from '../src/tasktree';
import { Theme } from '../src/theme';

const tree = TaskTree.tree();
const theme = new Theme();

describe('TaskTree', (): void => {
    it('Default', (): void => {
        expect(tree).not.toBeUndefined();

        tree.start(true);
    });

    describe('Manage tasks', (): void => {
        let task: Task;

        beforeEach((): void => {
            task = tree.add('Task X');
            task.log(`Log 1`).warn(`Warn 1`);
        });

        it('Skip', (): void => {
            task.skip();

            expect(stripAnsi(task.render(theme).join(Terminal.EOL))).toMatchSnapshot();
        });

        it('Fail', (): void => {
            try {
                task.error('Something bad happened\nat X\nat Y\nat Z').fail();
            } catch (err) {
                expect(stripAnsi(task.render(theme).join(Terminal.EOL))).toMatchSnapshot();
            }
        });

        it('Complete', (): void => {
            task.complete();

            expect(stripAnsi(task.render(theme).join(Terminal.EOL))).toMatchSnapshot();
        });
    });

    it('Render', (): void => {
        expect(stripAnsi(tree.render().join(Terminal.EOL))).toMatchSnapshot();
        tree.stop();
        expect(stripAnsi(tree.render().join(Terminal.EOL))).toMatchSnapshot();

        tree.start(true);
        tree.stop();
        expect(stripAnsi(tree.render().join(Terminal.EOL))).toMatchSnapshot();
    });

    it('Tree fail', (): void => {
        try {
            tree.start(true);
            tree.add('Task A');
            tree.fail('fail A');
        } catch (err) {
            expect(stripAnsi(tree.render().join(Terminal.EOL))).toMatchSnapshot();
            expect((err as Error).message).toBe('fail A');

            tree.stop();
        }

        try {
            tree.start(true);
            tree.add('Task B');
            tree.fail('fail B', false);
        } catch (err) {
            expect(stripAnsi(tree.render().join(Terminal.EOL))).toMatchSnapshot();
            expect((err as Error).message).toBe('fail B');

            tree.stop();
        }
    });
});
