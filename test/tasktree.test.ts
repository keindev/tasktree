import TaskTree from '../src/tasktree';

TaskTree.tree();

const tree = TaskTree.tree();
const task = tree.task('Test');

test('two plus two is four', (): void => {
    expect(2 + 2).toBe(4);
    expect(task.isPending()).toBe(true);
});
