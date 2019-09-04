# TaskTree

Singleton to manage the task tree.

## tree(\[theme\])

Method to get the object to control the tree.

### theme

Type: `object`

Theme properties. The field name is a modifier the value is [options](#theme-options).

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

### Modifiers

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

> If you use a gradient fill for the progress bar - the color will change from `active` to `success`.

### Options

-   `color`: `hex` color.
-   `figure`: symbol, add before title.
-   `badge`: text, added at the end, after the title.

## start(\[options\])

Starts output a task tree in a terminal at a defined interval. In “silent mode” - the task tree only collects tasks and is not output it in a terminal. Returns [TaskTree](#tasktree) instance.

### Options

#### silence

Type: `boolean`

Default: `false`

Disable task tree rendering.

#### autoClear

Type: `boolean`

Default: `false`

Removes all subtasks and bars from the main task.

## stop()

Stop output a task tree in a terminal. Returns [TaskTree](#tasktree) instance.

## exit()

Force the process to exit (see [process.exit](https://nodejs.org/api/process.html#process_process_exit_code)). Do nothing in 'silent mode'.

### code

Type: `number`

Default: `1`

Exit code.

## add(text)

Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task. Returns [Task](#task) instance.

### text

Text for display.

Type: `string`

## render()

Render a task tree into a `string[]`. Returns `strings` with tasks hierarchy.

## fail(text [, active])

Fail active task or adds a new subtask and call fail on it.

### text

Text for display.

Type: `string`

### active

Type: `boolean`

Default: `true`

If `true` - call failed for active task, else create new task and call fail on it.
