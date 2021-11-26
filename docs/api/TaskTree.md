# TaskTree

Singleton to manage the task tree

## Methods

### add

Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task

### exit

Force the process to exit (see process.exit). Do nothing in "silent mode"

### fail

Fail active task or adds a new subtask and call fail on it

### render

Render a task tree into a `string[]`. Returns strings with tasks hierarchy

### start

Starts output a task tree in a terminal at a defined interval. In “silent mode” - the task tree only collects tasks and is not output it in a terminal

### stop

Stop output a task tree in a terminal

### add

Adds a new task to the task tree. If there are active tasks, add a new one as a subtask - to the last subtask of the first active task

### fail

Fail active task or adds a new subtask and call fail on it

### tree

Method to get the object to control the tree (with [Theme](Theme.md))
