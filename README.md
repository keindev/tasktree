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

```javascript
const { TaskTree } = require('../lib/tasktree');
const tree = TaskTree.tree();

// start task tree log update in terminal
tree.start();

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
    // Log warning and error in task1 & fail it
    task1.warn('warning').error(new Error('something bad happened'));
    // stop task tree log update
    tree.stop();
});
```
