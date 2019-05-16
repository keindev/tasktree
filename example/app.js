const { TaskTree } = require('../lib/tasktree');
const tree = TaskTree.tree();

// start task tree log update in terminal
tree.start(true);

const task1 = tree.add('New task #1, level #1');
const task2 = tree.add('New task #2, level #2');
const task3 = task2.add('Another task...');

// ... whatever
const promise = new Promise(resolve => {
    setTimeout(() => {
        resolve('Warning');
    }, 2000);
});

promise.then(result => {
    // Skip task
    task3.skip('and it skipped');
    // Log info message in task2 & complete task
    task2.log('message #1').complete();
    // Log warning in task1 & fail it
    task1.warn('warning').fail();
    // stop task tree log update
    tree.stop();
});
