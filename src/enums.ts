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

export enum Color {
    Default = '#ffffff',
    Error = '#ff5555',
    Success = '#008000',
    Skip = '#e69500',
    Info = '#0000e6',
    Warning = '#ffa500',
    Exception = '#ff0000',
    Subtask = '#bbbbbb',
}

export enum Badges {
    Default = '',
    Error = '[fail]',
    Skip = '[skip]',
}
