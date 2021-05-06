# Class: TaskTree

[TaskTree](../modules/tasktree.md).TaskTree

Singleton to manage the task tree

## Table of contents

### Properties

- [TIMEOUT](tasktree.tasktree-1.md#timeout)

### Methods

- [add](tasktree.tasktree-1.md#add)
- [exit](tasktree.tasktree-1.md#exit)
- [fail](tasktree.tasktree-1.md#fail)
- [render](tasktree.tasktree-1.md#render)
- [start](tasktree.tasktree-1.md#start)
- [stop](tasktree.tasktree-1.md#stop)
- [add](tasktree.tasktree-1.md#add)
- [fail](tasktree.tasktree-1.md#fail)
- [tree](tasktree.tasktree-1.md#tree)

## Properties

### TIMEOUT

▪ `Static` `Readonly` **TIMEOUT**: ``100``= 100

## Methods

### add

▸ **add**(`text`: *string*): [*Task*](task.task-1.md)

Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | *string* | Text for display |

**Returns:** [*Task*](task.task-1.md)

___

### exit

▸ **exit**(`code?`: [*ExitCode*](../enums/tasktree.exitcode.md), `error?`: *string* \| Error): *void*

Force the process to exit (see process.exit). Do nothing in "silent mode"

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | [*ExitCode*](../enums/tasktree.exitcode.md) |
| `error?` | *string* \| Error |

**Returns:** *void*

___

### fail

▸ **fail**(`error`: *string* \| Error, `active?`: *boolean*): *never*

Fail active task or adds a new subtask and call fail on it

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `error` | *string* \| Error | - | Text or Error object for display |
| `active` | *boolean* | true | If `true` - call failed for active task, else create new task and call fail on it |

**Returns:** *never*

___

### render

▸ **render**(): *string*[]

Render a task tree into a `string[]`. Returns strings with tasks hierarchy

**Returns:** *string*[]

___

### start

▸ **start**(`__namedParameters?`: [*ITaskTreeOptions*](../interfaces/tasktree.itasktreeoptions.md)): [*TaskTree*](tasktree.tasktree-1.md)

Starts output a task tree in a terminal at a defined interval. In “silent mode” - the task tree only collects tasks and is not output it in a terminal

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `__namedParameters` | [*ITaskTreeOptions*](../interfaces/tasktree.itasktreeoptions.md) | {} |

**Returns:** [*TaskTree*](tasktree.tasktree-1.md)

___

### stop

▸ **stop**(): [*TaskTree*](tasktree.tasktree-1.md)

Stop output a task tree in a terminal

**Returns:** [*TaskTree*](tasktree.tasktree-1.md)

___

### add

▸ `Static` **add**(`text`: *string*): [*Task*](task.task-1.md)

Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | *string* |

**Returns:** [*Task*](task.task-1.md)

___

### fail

▸ `Static` **fail**(`error`: *string* \| Error, `active?`: *boolean*): *never*

Fail active task or adds a new subtask and call fail on it

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `error` | *string* \| Error | - |
| `active` | *boolean* | true |

**Returns:** *never*

___

### tree

▸ `Static` **tree**(`theme?`: ThemeOptions): [*TaskTree*](tasktree.tasktree-1.md)

Method to get the object to control the tree

**`example`**
```javascript
const theme = {
  default: '#ffffff',
  success: ['#008000', '✔'],
  skip: {
    symbol: '↓',
  },
  error: ['#ff0000', '✖', '[error]'],
  ...
};
```

**`description`**
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

> If you use a gradient fill for the progress bar - the color will change from `active` to `success`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `theme?` | ThemeOptions | Theme properties. The field name is a modifier the value is options |

**Returns:** [*TaskTree*](tasktree.tasktree-1.md)
