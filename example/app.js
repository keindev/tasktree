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
    task1
        .warn('warning')
        //.error(new Error('something bad happened'))
        .error(
            `Error: Something bad happened
        at tasks.reverse.every (/home/kein/projects/tasktree/test/tasktree.test.ts:30:36)
      at Array.every (<anonymous>)
      at Object.it (/home/kein/projects/tasktree/test/tasktree.test.ts:18:40)
      at Object.asyncJestTest (/home/kein/projects/tasktree/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)
      at resolve (/home/kein/projects/tasktree/node_modules/jest-jasmine2/build/queueRunner.js:43:12)
      at new Promise (<anonymous>)
      at mapper (/home/kein/projects/tasktree/node_modules/jest-jasmine2/build/queueRunner.js:26:19)
      at promise.then (/home/kein/projects/tasktree/node_modules/jest-jasmine2/build/queueRunner.js:73:41)
      at process._tickCallback (internal/process/next_tick.js:68:7)`
        )
        .fail();
    // stop task tree log update
    tree.stop();
});
