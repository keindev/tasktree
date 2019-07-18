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
            task.error('Something bad happened\nat X\nat Y\nat Z').fail();

            expect(stripAnsi(task.render(theme).join(Terminal.EOL))).toMatchSnapshot();
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
});
