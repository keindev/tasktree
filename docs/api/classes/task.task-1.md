# Class: Task

[Task](../modules/task.md).Task

Entity for managing a task - includes all child objects (informational messages, errors, progress bars, and tasks)

## Table of contents

### Constructors

- [constructor](task.task-1.md#constructor)

### Accessors

- [activeSubtask](task.task-1.md#activesubtask)
- [haveErrors](task.task-1.md#haveerrors)
- [havePendingSubtasks](task.task-1.md#havependingsubtasks)
- [haveSubtasks](task.task-1.md#havesubtasks)
- [haveWarnings](task.task-1.md#havewarnings)
- [id](task.task-1.md#id)
- [isPending](task.task-1.md#ispending)
- [status](task.task-1.md#status)
- [text](task.task-1.md#text)

### Methods

- [add](task.task-1.md#add)
- [bar](task.task-1.md#bar)
- [clear](task.task-1.md#clear)
- [complete](task.task-1.md#complete)
- [error](task.task-1.md#error)
- [fail](task.task-1.md#fail)
- [log](task.task-1.md#log)
- [render](task.task-1.md#render)
- [skip](task.task-1.md#skip)
- [update](task.task-1.md#update)
- [warn](task.task-1.md#warn)

## Constructors

### constructor

\+ **new Task**(`text`: *string*, `__namedParameters?`: [*ITaskOptions*](../interfaces/task.itaskoptions.md)): [*Task*](task.task-1.md)

#### Parameters:

Name | Type |
:------ | :------ |
`text` | *string* |
`__namedParameters` | [*ITaskOptions*](../interfaces/task.itaskoptions.md) |

**Returns:** [*Task*](task.task-1.md)

## Accessors

### activeSubtask

• get **activeSubtask**(): [*Task*](task.task-1.md)

First leaf subtask of the task tree, if it exists, otherwise, the object itself

**Returns:** [*Task*](task.task-1.md)

___

### haveErrors

• get **haveErrors**(): *boolean*

**Returns:** *boolean*

___

### havePendingSubtasks

• get **havePendingSubtasks**(): *boolean*

**Returns:** *boolean*

___

### haveSubtasks

• get **haveSubtasks**(): *boolean*

**Returns:** *boolean*

___

### haveWarnings

• get **haveWarnings**(): *boolean*

**Returns:** *boolean*

___

### id

• get **id**(): *number*

**Returns:** *number*

___

### isPending

• get **isPending**(): *boolean*

**Returns:** *boolean*

___

### status

• get **status**(): [*TaskStatus*](../enums/task.taskstatus.md)

Current task status

**Returns:** [*TaskStatus*](../enums/task.taskstatus.md)

___

### text

• get **text**(): *string*

Text to display

**Returns:** *string*

## Methods

### add

▸ **add**(`text`: *string*, `__namedParameters?`: [*ITaskOptions*](../interfaces/task.itaskoptions.md)): [*Task*](task.task-1.md)

#### Parameters:

Name | Type |
:------ | :------ |
`text` | *string* |
`__namedParameters` | [*ITaskOptions*](../interfaces/task.itaskoptions.md) |

**Returns:** [*Task*](task.task-1.md)

___

### bar

▸ **bar**(`template?`: *string*, `options?`: [*IProgressBarOptions*](../interfaces/progressbar.iprogressbaroptions.md)): [*ProgressBar*](progressbar.progressbar-1.md)

Adds a new progress bar. Returns a progress bar object

#### Parameters:

Name | Type |
:------ | :------ |
`template?` | *string* |
`options?` | [*IProgressBarOptions*](../interfaces/progressbar.iprogressbaroptions.md) |

**Returns:** [*ProgressBar*](progressbar.progressbar-1.md)

___

### clear

▸ **clear**(): *void*

Removes all subtasks and progress bars

**Returns:** *void*

___

### complete

▸ **complete**(`text?`: *string*, `clear?`: *boolean*): [*Task*](task.task-1.md)

#### Parameters:

Name | Type |
:------ | :------ |
`text?` | *string* |
`clear` | *boolean* |

**Returns:** [*Task*](task.task-1.md)

___

### error

▸ **error**(`error?`: *string* \| Error, `fail?`: *boolean*): [*Task*](task.task-1.md)

#### Parameters:

Name | Type |
:------ | :------ |
`error?` | *string* \| Error |
`fail?` | *boolean* |

**Returns:** [*Task*](task.task-1.md)

___

### fail

▸ **fail**(`error?`: *string* \| Error, `clear?`: *boolean*): *never*

#### Parameters:

Name | Type |
:------ | :------ |
`error?` | *string* \| Error |
`clear` | *boolean* |

**Returns:** *never*

___

### log

▸ **log**(`text`: *string*): [*Task*](task.task-1.md)

#### Parameters:

Name | Type |
:------ | :------ |
`text` | *string* |

**Returns:** [*Task*](task.task-1.md)

___

### render

▸ **render**(`theme`: *Theme*, `level?`: *number*): *string*[]

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`theme` | *Theme* | - |
`level` | *number* | 0 |

**Returns:** *string*[]

___

### skip

▸ **skip**(`text?`: *string*, `clear?`: *boolean*): [*Task*](task.task-1.md)

#### Parameters:

Name | Type |
:------ | :------ |
`text?` | *string* |
`clear` | *boolean* |

**Returns:** [*Task*](task.task-1.md)

___

### update

▸ **update**(`text`: *string*): [*Task*](task.task-1.md)

Update task text

#### Parameters:

Name | Type |
:------ | :------ |
`text` | *string* |

**Returns:** [*Task*](task.task-1.md)

___

### warn

▸ **warn**(`text`: *string*): [*Task*](task.task-1.md)

#### Parameters:

Name | Type |
:------ | :------ |
`text` | *string* |

**Returns:** [*Task*](task.task-1.md)
