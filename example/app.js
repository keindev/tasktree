const { TaskTree } = require('../lib/tasktree');
const tree = TaskTree.tree();

// start task tree log update in terminal
tree.start();

const task1 = tree.add('New task #1, level #1');
const task2 = tree.add('New task #2, level #2');
const task3 = task2.add('Another task...');
const bars = [
    task3.bar(),
    task3.bar(':bar :rate/bps :percent :etas (R)', {
        clear: true, // Removed at 100%
    }),
];

// ... whatever
const promises = [60, 70].map((ms, i) => {
    return new Promise(resolve => {
        const handle = setInterval(() => {
            if (bars[i].tick(Math.random() * 10)) {
                clearInterval(handle);
                resolve();
            }
        }, ms);
    });
});

Promise.all(promises).then(() => {
    // Skip task
    task3.skip('and it skipped');
    // Log info message in task2 & complete task
    task2.log('message #1').complete();
    // Log warning and error in task1 & fail it
    task1.warn('warning').error(new Error('something bad happened'), true);
    // stop task tree log update
    tree.stop();
});
