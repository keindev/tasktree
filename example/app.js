/* eslint-disable */
import TaskTree from '../src/index.js';
import Enquirer from 'enquirer';

const tree = TaskTree.tree();

try {
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
    return new Promise(resolve => {
      const handle = setInterval(() => {
        const bar = bars[i];

        if (bar) {
          if (once) {
            if (bar.percent >= 50) {
              bar.skip();
            } else {
              bar.fail();
            }
          } else {
            once = bar.tick(Math.random() * 10).isCompleted;
          }
        }

        if (once) {
          clearInterval(handle);
          resolve();
        }
      }, ms);
    });
  });

  await Promise.all(promises);

  await tree.pause(async () => {
    const prompt = new Enquirer.Input({ name: 'username', message: 'What is your username?' });

    await prompt.run().then(answer => console.log('Username:', answer));

    // Return count of output rows if necessary to remove its from output.
    // TaskTree can't automatically detect external output rows count
    return 2;
  });

  // skip task
  task3.skip('Subtask skipped');
  // log info message in Task #2, complete task
  task2.log('Informational message').complete();
  // log warning and error in Task #1, fail it
  task1.warn('Warning message').error(new Error('Something bad happened'), true);
  // stop task tree log update
  tree.stop();
} catch (error) {
  tree.fail(error);
}
