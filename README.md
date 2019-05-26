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

Theme properties. The field name is a modifier, the value is [options](#theme-options).

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

##### Theme options

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

#### start(\[silence\])

Starts output a task tree in a terminal at a certain interval. In “silent mode” the task tree only collects tasks and is not output it in terminal. Returns the instance.

##### silence

Disable task tree rendering.

Type: `boolean`

Default: `false`

#### stop()

Stop output a task tree in a terminal. Returns the instance.

#### exit()

Force the process to exit (see [process.exit](https://nodejs.org/api/process.html#process_process_exit_code)). Do nothing in 'silent mode'.

##### code

Exit code.

Type: `number`

Default: `1`

#### add(text)

Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task. Returns `Task` instance.

##### text

Text to display.

Type: `string`

#### render()

Render a task tree in to string. Return string with tasks hierarchy.

### Task

An entity for manipulating a task containing all dependent objects (informational messages, errors, progress bars and tasks).

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

Returns the first leaf subtask of the task tree, if it exists, otherwise the object itself will return.

#### isPending()

Returns a boolean value indicating `status` of the task.

#### havePendingSubtasks()

Returns a boolean value indicating `status` of the subtasks.

#### haveSubtasks()

Returns a boolean value indicating the presence of subtasks.

#### add(text, \[status\]): Task

Adds a new subtask. Returns subtask object.

##### text

Text to display.

Type: `string`

##### status

New subtask [status](#task-statuses).

Type: `number`

Default: `0`

#### bar(\[template\], \[options\])

Adds a new progress bar. Returns progress bar object.

##### template

Text to display with [tokens](#progress-bar-tokens).

Type: `string`

Default: `:bar :rate/bps :percent :etas`

##### options

These are keys in the options object you can pass to the progress bar along. See [Bar.Options](#progress-bar-options)

Type: `object`

Default: `null`

#### clear()

Remove all subtasks and bars.

#### complete(\[text\], \[clear\])

Complete task. Returns self object.

##### text

Text to display. Modifies task text if submitted.

Type: `string`

Default: `''`

##### clear

Calls `clear()` if true.

Type: `boolean`

Default: `false`

#### skip(\[text\], \[clear\])

Skip task. Returns self object.

##### text

Text to display. Modifies task text if submitted.

Type: `string`

Default: `''`

##### clear

Calls `clear()` if true.

Type: `boolean`

Default: `false`

#### fail(\[text\], \[clear\])

Failure task. Returns self object.

##### text

Text to display. Modifies task text if submitted.

Type: `string`

Default: `''`

##### clear

Calls `clear()` if true.

Type: `boolean`

Default: `false`

#### error(error, \[fail\])

Adds an error message to the task, which will be displayed immediately under the task header. Returns self object.

##### error

Error message.

Type: `string | Error`

##### fail

Flag indicating the need to call the `fail` method.

Type: `boolean`

Default: `false`

#### log(\[text\])

Add informational message, which will be displayed under the task header. Returns self object.

##### text

Informational message.

Type: `string`

#### warn(\[text\])

Add warning message, which will be displayed under the task header. Returns self object.

##### text

Warning message.

Type: `string`

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

Current completed index.

Type: `number`

Default: `0`

##### total

Total number of ticks to complete.

Type: `number`

Default: `1000`

##### width

The displayed width of the progress bar defaulting to total.

Type: `number`

Default: `20`

##### complete

Completion character.

Type: `string`

Default: `▇`

##### incomplete

Incomplete character.

Type: `string`

Default: `▇`

##### clear

Option to clear the bar on completion.

Type: `boolean`

Default: `false`

##### badges

Option to add badge.

Type: `boolean`

Default: `true`

##### gradient

Option to add gradient to pending bar.

Type: `boolean`

Default: `true`

#### getRatio()

Returns ratio `current` value and `total` value.

#### getPercent()

Returns the percentage of completion.

#### getElapsed()

Returns the elapsed time from the beginning, in milliseconds.

#### getRate()

Returns progress rate.

#### getETA()

Returns progress ETA (_estimated time of arrival_).

#### getStart()

Returns start `Date`, in milliseconds.

#### getEnd()

Returns the end `Date`, in milliseconds, if progress is ended.

#### isCompleted()

Returns a boolean value indicating the progress bar status.

#### tick(\[step\], \[tokens\]): Progress

Increases current progress with specified step. Returns self object.

##### step

The value by which the current progress will increase.

Type: `number`

Default: `1`

##### tokens

Add custom tokens by adding a {'name': value} object parameter to your method.

Type: `object`

Default: `null`

###### Tick with custom tokens example

```javascript
const bar = new Progress(':bar tempalte with custom :token');

bat.tick(10, { token: 100 });
```

##### complete()

Completes progress and marks it as successful.

##### skip()

Stops the progress and marks it as skipped.

##### fail()

Stops the progress and marks it as failed.

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
