export enum Status {
    Pending = 0,
    Completed = 1,
    Failed = 2,
    Skipped = 3,
}

export enum Type {
    Default = 'default',
    Active = 'active',
    Success = 'success',
    Skip = 'skip',
    Error = 'error',
    Info = 'info',
    Warning = 'warning',
    Exception = 'exception',
    Subtask = 'subtask',
    List = 'list',
    Dim = 'dim',
}

export enum Color {
    Default = '',
    Active = '#e69500',
    Success = '#008000',
    Skip = '#e69500',
    Error = '#ff5555',
    Info = '#0000e6',
    Warning = '#ffa500',
    Exception = '#ff0000',
    Subtask = '#bbbbbb',
    List = '#e69500',
    Dim = '#bbbbbb',
}

export enum Badges {
    Default = '',
    Error = '[fail]',
    Skip = '[skip]',
}
