import stripAnsi from 'strip-ansi';
import { Terminal } from 'stdout-update/lib/terminal';
import { Task } from '../src/task';
import { TaskTree } from '../src/tasktree';
import { Theme } from '../src/theme';

const tree = TaskTree.tree();
const theme = new Theme();
const titles = ['Task1', 'Task2', 'Task3'];

let tasks: Task[];

describe('TaskTree', (): void => {
    it('Creating', (): void => {
        expect(tree).not.toBeUndefined();

        tree.start(true);
        tasks = titles.map((title): Task => tree.add(title));
    });

    it('Manage', (): void => {
        const error = 'Something bad happened\nat X\nat Y\nat Z';
        const result = tasks.reverse().every((task, index): boolean => {
            expect(task.isPending()).toBeTruthy();
            expect(task.render(theme).length).toBeGreaterThanOrEqual(1);

            task.log(`Log ${index}`).warn(`Warn ${index}`);

            switch (index) {
                case 0:
                    task.skip();
                    break;
                case tasks.length - 1:
                    task.error(error).fail();
                    break;
                default:
                    task.complete();
                    break;
            }

            return !task.isPending();
        });

        expect(result).toBeTruthy();
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
