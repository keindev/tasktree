# Task

Entity for managing a task - includes all child objects (informational messages, errors, progress bars, and tasks).

## Task statuses

-   Pending: `0`
-   Completed: `1`
-   Failed: `2`
-   Skipped: `3`

## API

### id()

Returns task `uid`.

### getText()

Returns task text to display.

### getStatus()

Returns current task [status](#task-statuses).

### getActive()

Returns the first leaf subtask of the task tree, if it exists, otherwise, the object itself.

### isPending()

Returns a Boolean value - indicating the [status](#task-statuses) of the task.

### haveWarnings()

Returns a Boolean value - indicating the [task](#task) have warnings.

### haveErrors()

Returns a Boolean value - indicating the [task](#task) have errors.

### havePendingSubtasks()

Returns a Boolean value - indicating the [status](#task-statuses) of the subtask.

### haveSubtasks()

Returns a boolean value - indicating the presence of subtasks.

### add(text \[, options\])

Adds a new subtask. Returns a [subtask](#task) object.

#### text

Text for display.

Type: `string`

#### Options

New subtask options.

##### status

Type: `number`

Default: `0`

New subtask [status](#task-statuses).

##### autoClear

Type: `boolean`

Default: `false`

Removes all subtasks and progress bars after complete.

### update(text)

Update task text.

#### text

Text for display.

Type: `string`

### bar(\[template\, options\])

Adds a new progress bar. Returns a [progress bar](#progress-bar) object.

#### template

Type: `string`

Default: `:bar :rate/bps :percent :etas`

Text for display with [tokens](#progress-bar-tokens).

#### options

Type: `object`

Default: `null`

These are keys in the options object you can pass to the progress bar along. See [ProgressBar.Options](./progress-bar.md)

### clear()

Removes all subtasks and progress bars.

### complete(\[text, clear\])

Complete task. Returns [self-object](#task).

#### text

Type: `string`

Default: `''`

Text for display. Modifies task text if submitted.

#### clear

Type: `boolean`

Default: `false`

Calls `clear()` if true.

#### skip(\[text, clear\])

Skip task. Returns [self-object](#task).

#### text

Type: `string`

Default: `''`

Text for display. Modifies task text if submitted.

#### clear

Type: `boolean`

Default: `false`

Calls `clear()` if true.

### fail(\[text, clear\])

Failure task. Throws exception in "silent mode".

#### text

Type: `string`

Default: `''`

Text for display. Modifies task text if submitted.

#### clear

Type: `boolean`

Default: `false`

Calls `clear()` if true.

### error(error \[, fail\])

Adds an error message to the task, which will be displayed immediately under the task header. Returns [self-object](#task).

#### error

Type: `string | Error`

Error message.

#### fail

Type: `boolean`

Default: `false`

Flag indicating the need to call the `fail` method.

### log(\[text\])

Adds an informational message, to be displayed under the task title. Returns [self-object](#task).

#### text

Type: `string`

Informational message.

### warn(\[text\])

Adds a warning message, to be displayed under the task title. Returns [self-object](#task).

#### text

Type: `string`

Warning message.
