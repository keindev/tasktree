const { TaskTree } = require('../lib/tasktree');
const tree = TaskTree.tree();

// start task tree log update in terminal
tree.start();

// create tasks
const task1 = tree.add('Task #1');
const task2 = tree.add('Task #2');
const task3 = task2.add('Subtask...');
const tpl = ':bar :rate/bps :percent :etas';
// create progress bars
const bars = [task3.bar(tpl), task3.bar(tpl), task3.bar(tpl)];

// ... whatever
let once = false;
let test = 0;
const promises = [50, 75, 200].map((ms, i) => {
    return new Promise(resolve => {
        const handle = setInterval(() => {
            task3.log('test' + test++);

            if (once) {
                if (bars[i].getPercent() >= 50) {
                    bars[i].skip();
                } else {
                    bars[i].fail();
                }
            } else {
                once = bars[i].tick(Math.random() * 10).isCompleted();
            }

            if (once) {
                clearInterval(handle);
                resolve();
            }
        }, ms);
    });
});

Promise.all(promises).then(() => {
    for (let i = 0; i < 30; i++) {
        task3.add('wow' + i).complete();
    }

    // skip task
    task3.skip('Subtask skipped');
    // log info message in Task #2, complete task
    task2.log('Informational message').complete();
    // log warning and error in Task #1, fail it
    task1.warn('Warning message').error(new Error('Something bad happened'), true);
    // stop task tree log update
    tree.stop();
});
