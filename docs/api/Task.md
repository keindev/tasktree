# Task

Entity for managing a task - includes all child objects (informational messages, errors, progress bars, and tasks)

## Constructor

```typescript
new Task(text?: string, options?: ITaskOptions)
```

#### Parameters

| Name                | Type      | Description                                               |
| :------------------ | :-------- | :-------------------------------------------------------- |
| `text`              | _string_  | Task text message                                         |
| `options.autoClear` | _boolean_ | Removes all subtasks and progress bars after complete     |
| `options.status`    | _enum_    | New subtask status `(Completed, Failed, Pending,Skipped`) |

## Methods

### add

Create new subtask

### bar

Adds a new progress bar. Returns a progress bar object

### clear

Removes all subtasks and progress bars

### complete

Complete task

### error

Add new task error

### fail

Fail task

### log

Add log message

### render

Render task output

### skip

Skip task

### update

Update task text

### warn

Add task warning
