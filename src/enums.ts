export enum Status {
    Pending = 0,
    Completed = 1,
    Failed = 2,
    Skipped = 3,
}

export enum Type {
    Default = 'default',
    Error = 'error',
    Success = 'success',
    Skip = 'skip',
    Info = 'info',
    Warning = 'warning',
    Exception = 'exception',
    Subtask = 'subtask',
}
