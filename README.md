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

```console
npm install tasktree-cli --save-dev

yarn add tasktree-cli --dev
```

## API

### TaskTree

Singleton to manage the task tree.

#### tree(\[theme\])

Method to get the object to control the tree.

##### theme

Type: `object`

Theme properties. The field name is a modifier, the value is `options`.

##### Modifiers

| option      | color             | symbol | badge | description                                  |
| ----------- | ----------------- | ------ | ----- | -------------------------------------------- |
| **default** | text              | ✖      | ✖     | default color                                |
| **active**  | symbol            | ✔      | ✖     | spinner, progress bar color                  |
| **success** | symbol, text, bar | ✔      | ✖     | task symbol, progress bar color              |
| **skip**    | symbol, text, bar | ✔      | ✔     | task symbol, progress bar color              |
| **error**   | symbol, text, bar | ✔      | ✔     | task symbol, error title, progress bar color |
| **message** | symbol            | ✔      | ✖     | dim pointer to task information              |
| **info**    | symbol            | ✔      | ✖     | information message symbol                   |
| **warning** | symbol            | ✔      | ✖     | warning message symbol                       |
| **subtask** | symbol, text      | ✔      | ✖     | dim pointer to subtask                       |
| **list**    | symbol            | ✔      | ✖     | list symbol                                  |
| **dim**     | symbol, bar       | ✖      | ✖     | dim color                                    |

###### \* If you use a gradient fill for the progress bar, the color will change from `active` to`success`

##### Options:

-   `color`: `hex` color.
-   `figure`: symbol, add before title.
-   `badge`: text, added at the end, after title.

##### Example

```js
const theme = {
    default: '#ffffff',
    success: ['#008000', '✔'],
    skip: {
        symbol: '↓',
    },
    error: ['#ff0000', '✖', '[error]'],
};
```

#### start

Starts output a task tree in a terminal at a certain interval. In “silent mode” the task tree only collects tasks and is not output it in terminal. Returns the instance.

##### silence

Disable task tree rendering.

Type: `boolean`

Default: `false`

#### stop

Stop output a task tree in a terminal. Returns the instance.

#### exit

Force the process to exit (see [process.exit](https://nodejs.org/api/process.html#process_process_exit_code)). Do nothing in 'silent mode'.

##### code

Exit code.

Type: `number`

Default: `1`

#### add

Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task. Returns `Task` instance.

##### text

Text to display.

Type: `string`

#### render

Render a task tree in to string. Return string with tasks hierarchy.

### Task

### Bar

## Usage

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

## License

[MIT](LICENSE)
