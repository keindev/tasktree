const { TaskTree } = require('../lib/tasktree');
const tree = TaskTree.tree();

// start task tree log update in terminal
tree.start();

const task1 = tree.add('New task #1, level #1');
const task2 = tree.add('New task #2, level #2');
const task3 = task2.add('Another task...');
const bars = [task3.bar(), task3.bar()];

// ... whatever
const promise = new Promise(resolve => {
    setTimeout(() => resolve('Warning'), 3000);
});

const promises = [2, 4].map((tick, index) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (bars[index].tick(tick)) resolve();
        }, tick);
    });
});

Promise.all(promises).then(() => {
    promise.then(result => {
        // Skip task
        task3.skip('and it skipped');
        // Log info message in task2 & complete task
        task2.log('message #1').complete();
        // Log warning and error in task1 & fail it
        task1.warn(result).error(new Error('something bad happened'));
        // stop task tree log update
        tree.stop();
    });
});
