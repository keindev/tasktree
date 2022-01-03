<p align="center"><img src="https://cdn.jsdelivr.net/gh/keindev/tasktree/media/banner.svg" alt="Package logo"></p>

<p align="center">
    <a href="https://travis-ci.com/keindev/tasktree"><img src="https://travis-ci.com/keindev/tasktree.svg?branch=master" alt="Build Status"></a>
    <a href="https://codecov.io/gh/keindev/tasktree"><img src="https://codecov.io/gh/keindev/tasktree/branch/master/graph/badge.svg" /></a>
    <a href="https://www.npmjs.com/package/tasktree-cli"><img alt="npm" src="https://img.shields.io/npm/v/tasktree-cli.svg"></a>
    <a href="https://github.com/tagproject/ts-package-shared-config"><img src="https://img.shields.io/badge/standard--shared--config-nodejs%2Bts-green?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAfCAYAAACh+E5kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJQSURBVHgB1VftUcMwDFU4/tMNyAZ0A7IBbBA2CExAmIBjApcJChO0TFA2SJkgMIGRyDNV3TSt26RN353OX/LHUyTZIdoB1tqMZcaS0imBDzxkeWaJWR51SX0HrJ6pdsJyifpdb4loq3v9A+1CaBuWMR0Q502DzuJRFD34Y9z3DXIRNy/QPWKZY27COlM6BtZZHWMJ3CkVa28KZMTJkDpCVLOhs/oL2gMuEhYpxeenPPah9EdczLkvpwZgnQHWnlNLiNQGYiWx5gu6Ehz4m+WNN/2i9Yd75CJmeRDXogbIFxECrqQ2wIvlLBOXaViuYbGQNSQLFSGZyOnulb2wadaGnyoSSeC8GBJkNDf5kloESAhy2gFIIPG2+ufUMtivn/gAEi+Gy4u6FLxh/qer8/xbLq7QlNh6X4mbtr+A3pylDI0Lb43YrmLmXP5v3a4I4ABDRSI4xjB/ghveoj4BCVm37JQADhGDgOA+YJ48TSaoOwKpt27aOQG1WRES3La65WPU3dysTjE8de0Aj8SsKS5sdS9lqCeYI08bU6d8EALYS5OoDW4c3qi2gf7f+4yODfj2DIcqdVzYKnMtEUO7RP2gT/W1AImxXSC3i7R7rfRuMT5G2xzSYzaCDzOyyzDeuNHZx1a3fOdJJwh28fRwwT1QY6Xzf7TvWG6ob/BIGPQ59ymUngRyRn2El6Fy5T7G0zl+JmoC3KRQXyT1xpfiJKIeAemzqBl6U3V5ocZNf4hHg61u223wn4nOqF8IzvF9IxCMkyfQ+i/lnnhlmW6h9+Mqv1SmQhehji4JAAAAAElFTkSuQmCC" alt="Standard Shared Config"></a>
</p>

Simple terminal task tree - helps you keep track of your tasks in a tree structure.

<img src="media/demo.gif">

## Install

```console
npm install tasktree-cli
```

## Usage

```typescript
import TaskTree from 'tasktree-cli';

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
        resolve('');
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

TaskTree uses [chalk-template](https://www.npmjs.com/package/chalk-template) to style text and supports formatting as a [tagged template literal](https://www.npmjs.com/package/chalk#tagged-template-literal).

```typescript
const task = new Task('{underline.cyan.bold Awesome task}');
```

## API

Read the [API documentation](docs/api/index.md) for more information.
