<p align="center"><img width="200" src="https://cdn.jsdelivr.net/gh/keindev/tasktree/media/logo.svg" alt="TaskTree logo"></p>

<p align="center">
    <a href="https://travis-ci.org/keindev/tasktree"><img src="https://travis-ci.org/keindev/tasktree.svg?branch=master" alt="Build Status"></a>
    <a href="https://www.codacy.com/app/keindev/tasktree?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=keindev/tasktree&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/5df2abb40a7048fba8b891d4c05b5156"/></a>
    <a href="https://www.codacy.com/app/keindev/tasktree?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=keindev/tasktree&amp;utm_campaign=Badge_Coverage"><img src="https://api.codacy.com/project/badge/Coverage/5df2abb40a7048fba8b891d4c05b5156"/></a>
    <a href="https://www.npmjs.com/package/tasktree-cli"><img alt="npm" src="https://img.shields.io/npm/v/tasktree-cli.svg"></a>
    <a href="https://www.npmjs.com/package/tasktree-cli"><img alt="NPM" src="https://img.shields.io/npm/l/tasktree-cli.svg"></a>
</p>

<h1 align="center">TaskTree</h1>

Simple terminal task tree helps you keep track of your tasks in a tree structure

<img src="media/demo.gif">

## Install

```shell
$ npm install tasktree-cli --save-dev
$ yarn add tasktree-cli --dev
```

## Usage

### TaskTree

### Theme

### Task

### Bar

## Examples

```javascript
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
const promises = [50, 75, 200].map((ms, i) => {
    return new Promise(resolve => {
        const handle = setInterval(() => {
            if (once) {
                if (bars[i].getPercent() >= 50) {
                    bars[i].skip();
                } else {
                    bars[i].fail();
                }

                clearInterval(handle);
                resolve();
            } else if ((once = bars[i].tick(Math.random() * 10).isCompleted())) {
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
