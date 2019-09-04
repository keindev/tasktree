<p align="center"><img width="200" src="https://cdn.jsdelivr.net/gh/keindev/tasktree/media/logo.svg" alt="TaskTree logo"></p>

<p align="center">
    <a href="https://travis-ci.com/keindev/tasktree"><img src="https://travis-ci.com/keindev/tasktree.svg?branch=master" alt="Build Status"></a>
    <a href="https://codecov.io/gh/keindev/tasktree"><img src="https://codecov.io/gh/keindev/tasktree/branch/master/graph/badge.svg" /></a>
    <a href="https://www.npmjs.com/package/tasktree-cli"><img alt="npm" src="https://img.shields.io/npm/v/tasktree-cli.svg"></a>
    <a href="https://www.npmjs.com/package/tasktree-cli"><img alt="NPM" src="https://img.shields.io/npm/l/tasktree-cli.svg"></a>
</p>

Simple terminal task tree - helps you keep track of your tasks in a tree structure.

<img src="media/demo.gif">

## Install

### Yarn

```
yarn add tasktree-cli
```

### NPM

```
npm install tasktree-cli
```

## Usage

```javascript
const { TaskTree } = require('tasktree-cli');
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
    return new Promise(resolve => {
        const handle = setInterval(() => {
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
    // skip task
    task3.skip('Subtask skipped');
    // log info message in Task #2, complete task
    task2.log('Informational message').complete();
    // log warning and error in Task #1, fail it
    task1.warn('Warning message').error(new Error('Something bad happened'), true);
    // stop task tree log update
    tree.stop();
});
```

TaskTree uses [chalk](https://www.npmjs.com/package/chalk) to style text and supports formatting as a [tagged template literal](https://www.npmjs.com/package/chalk#tagged-template-literal).

```javascript
const task = new Task('{underline.cyan.bold Awesome task}');
```

## API

-   [Task Tree](./docs/task-tree.md) - Singleton to manage the task tree.
-   [Task](./docs/task.md) - Entity for managing a task - includes all child objects (informational messages, errors, progress bars, and tasks)
-   [Progress Bar](./docs/progress-bar.md)

## License

[MIT](LICENSE)
