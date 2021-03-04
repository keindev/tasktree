const { TaskTree } = require('../lib/TaskTree');
const tree = TaskTree.tree();

// start task tree log update in terminal
tree.start();

// create tasks
const task1 = tree.add('{underline Task {bold #1}}');
const task2 = tree.add('Task {bold #2}');
const task3 = task2.add('Subtask...');
const tpl = ':bar :rate/bps {cyan.bold :percent} :etas';
// create progress bars
const bars = [task3.bar(tpl), task3.bar(tpl), task3.bar(tpl)];

// ... whatever
let once = false;
const promises = [50, 75, 200].map((ms, i) => {
  return new Promise((resolve) => {
    const handle = setInterval(() => {
      if (once) {
        if (bars[i].percent >= 50) {
          bars[i].skip();
        } else {
          bars[i].fail();
        }
      } else {
        once = bars[i].tick(Math.random() * 10).isCompleted;
      }

      if (once) {
        clearInterval(handle);
        resolve();
      }
    }, ms);
  });
});

Promise.all(promises).then(() => {
  // skip task
  task3.skip('Subtask skipped');
  // log info message in Task #2, complete task
  task2.log('Informational message').complete();
  // log warning and error in Task #1, fail it
  task1.warn('Warning message').error(new Error('Something bad happened'), true);
  // stop task tree log update
  tree.stop();
});
