import Task from '../src/task';
import TaskTree from '../src/tasktree';

const tree = TaskTree.tree();
const titles = ['Task1', 'Task2', 'Task3'];
let tasks: Task[];

describe('TaskTree', (): void => {
    it('creating', (): void => {
        expect(tree).not.toBeUndefined();

        tree.start(true);
        tasks = titles.map((title): Task => tree.add(title));
    });

    it('manage', (): void => {
        const result = tasks.reverse().every(
            (task, index): boolean => {
                expect(task.isPending()).toBeTruthy();
                expect(task.render().length).toBeGreaterThan(1);

                task.log(`Log ${index}`).warn(`Warn ${index}`);

                switch (index) {
                    case 0:
                        task.skip();
                        break;
                    case tasks.length - 1:
                        task.fail('Fail');
                        break;
                    default:
                        task.complete();
                }

                return !task.isPending();
            }
        );

        expect(result).toBeTruthy();
    });

    it('render', (): void => {
        expect(tree.render()).toMatchSnapshot();
        tree.stop(true);
        expect(tree.render()).toMatchSnapshot();

        tree.start(true);
        tree.stop(true);
        expect(tree.render()).toMatchSnapshot();
    });
});
