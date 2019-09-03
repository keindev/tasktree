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

### TaskTree

Singleton to manage the task tree.

#### tree(\[theme\])

Method to get the object to control the tree.

##### theme

Type: `object`

Theme properties. The field name is a modifier the value is [options](#theme-options).

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

###### \* If you use a gradient fill for the progress bar - the color will change from `active` to `success`.

##### Theme options

-   `color`: `hex` color.
-   `figure`: symbol, add before title.
-   `badge`: text, added at the end, after the title.

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

#### start(\[silence\])

Starts output a task tree in a terminal at a defined interval. In “silent mode” - the task tree only collects tasks and is not output it in a terminal. Returns [TaskTree](#tasktree) instance.

##### silence

Type: `boolean`

Default: `false`

Disable task tree rendering.

#### stop()

Stop output a task tree in a terminal. Returns [TaskTree](#tasktree) instance.

#### exit()

Force the process to exit (see [process.exit](https://nodejs.org/api/process.html#process_process_exit_code)). Do nothing in 'silent mode'.

##### code

Type: `number`

Default: `1`

Exit code.

#### add(text)

Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task. Returns [Task](#task) instance.

##### text

Text for display.

Type: `string`

#### render()

Render a task tree into a `string[]`. Returns `strings` with tasks hierarchy.

#### fail(text [, active])

Fail active task or adds a new subtask and call fail on it.

##### text

Text for display.

Type: `string`

##### active

Type: `boolean`

Default: `true`

If `true` - call failed for active task, else create new task and call fail on it.

### Task

Entity for managing a task - includes all child objects (informational messages, errors, progress bars, and tasks).

#### Task statuses

-   Pending: `0`
-   Completed: `1`
-   Failed: `2`
-   Skipped: `3`

#### id()

Returns task `uid`.

#### getText()

Returns task text to display.

#### getStatus()

Returns current task [status](#task-statuses).

#### getActive()

Returns the first leaf subtask of the task tree, if it exists, otherwise, the object itself.

#### isPending()

Returns a Boolean value - indicating the [status](#task-statuses) of the task.

#### haveWarnings()

Returns a Boolean value - indicating the [task](#task) have warnings.

#### haveErrors()

Returns a Boolean value - indicating the [task](#task) have errors.

#### havePendingSubtasks()

Returns a Boolean value - indicating the [status](#task-statuses) of the subtask.

#### haveSubtasks()

Returns a boolean value - indicating the presence of subtasks.

#### add(text \[, status\]): Task

Adds a new subtask. Returns a [subtask](#task) object.

##### text

Text for display.

Type: `string`

##### status

Type: `number`

Default: `0`

New subtask [status](#task-statuses).

#### update(text): Task

Update task text.

##### text

Text for display.

Type: `string`

#### bar(\[template\, options\])

Adds a new progress bar. Returns a [progress bar](#progress-bar) object.

##### template

Type: `string`

Default: `:bar :rate/bps :percent :etas`

Text for display with [tokens](#progress-bar-tokens).

##### options

Type: `object`

Default: `null`

These are keys in the options object you can pass to the progress bar along. See [Bar.Options](#progress-bar-options)

#### clear()

Remove all subtasks and bars.

#### complete(\[text, clear\])

Complete task. Returns [self-object](#task).

##### text

Type: `string`

Default: `''`

Text for display. Modifies task text if submitted.

##### clear

Type: `boolean`

Default: `false`

Calls `clear()` if true.

#### skip(\[text, clear\])

Skip task. Returns [self-object](#task).

##### text

Type: `string`

Default: `''`

Text for display. Modifies task text if submitted.

##### clear

Type: `boolean`

Default: `false`

Calls `clear()` if true.

#### fail(\[text, clear\])

Failure task. Throws exception in "silent mode".

##### text

Type: `string`

Default: `''`

Text for display. Modifies task text if submitted.

##### clear

Type: `boolean`

Default: `false`

Calls `clear()` if true.

#### error(error \[, fail\])

Adds an error message to the task, which will be displayed immediately under the task header. Returns [self-object](#task).

##### error

Type: `string | Error`

Error message.

##### fail

Type: `boolean`

Default: `false`

Flag indicating the need to call the `fail` method.

#### log(\[text\])

Adds an informational message, to be displayed under the task title. Returns [self-object](#task).

##### text

Type: `string`

Informational message.

#### warn(\[text\])

Adds a warning message, to be displayed under the task title. Returns [self-object](#task).

##### text

Type: `string`

Warning message.

### Progress bar

#### Progress bar Tokens

-   `:bar` - the progress bar itself.
-   `:current` - current tick number.
-   `:total` - total ticks.
-   `:elapsed` - time elapsed in seconds.
-   `:percent` - completion percentage.
-   `:eta` - estimated completion time in seconds.
-   `:rate` - rate of ticks per second.

#### Progress bar Options

##### current

Type: `number`

Default: `0`

Current completed index.

##### total

Type: `number`

Default: `1000`

Total number of ticks to complete.

##### width

Type: `number`

Default: `20`

The displayed width of the progress bar defaulting to total.

##### complete

Type: `string`

Default: `▇`

Completion character.

##### incomplete

Type: `string`

Default: `▇`

Incomplete character.

##### clear

Type: `boolean`

Default: `false`

Option to clear the bar on completion.

##### badges

Type: `boolean`

Default: `true`

Option to add badge.

##### gradient

Type: `boolean`

Default: `true`

Option to add a gradient to the pending bar.

#### getRatio()

Returns ratio between `current` value and `total` value.

#### getPercent()

Returns current percent of completion.

#### getElapsed()

Returns an elapsed time from the beginning of progress, in milliseconds.

#### getRate()

Returns rate of progress.

#### getETA()

Returns progress ETA (_estimated time of arrival_).

#### getStart()

Returns start `Date` in milliseconds.

#### getEnd()

Returns an end `Date` in milliseconds if progress is an ended.

#### isCompleted()

Returns `true` if progress is complete.

#### tick(\[step, tokens\]): Progress

Increases current progress on step value. Returns [self-object](#progress-bar).

##### step

Type: `number`

Default: `1`

The value by which the current progress will increase.

##### tokens

Type: `object`

Default: `null`

Add custom tokens by adding a `{'name': value}` object parameter to your method.

###### Tick with custom tokens example

```javascript
const bar = new Progress(':bar tempalte with custom :token');

bat.tick(10, { token: 100 });
```

#### complete()

Completes progress and marks it as successful.

#### skip()

Stops the progress and marks it as skipped.

#### fail()

Stops the progress and marks it as failed.

## License

[MIT](LICENSE)
