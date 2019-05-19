export enum Status {
    Pending = 0,
    Completed = 1,
    Failed = 2,
    Skipped = 3,
}

export enum Level {
    Default = 0,
    Step = 1,
    Stride = 3,
}

export enum Indent {
    Default = 2,
    Empty = 0,
}

export enum Type {
    Default = 'default',
    Active = 'active',
    Success = 'success',
    Skip = 'skip',
    Error = 'error',
    Message = 'message',
    Info = 'info',
    Warning = 'warning',
    Exception = 'exception',
    Subtask = 'subtask',
    List = 'list',
    Dim = 'dim',
}

export enum Color {
    Default = '',
    Active = '#4285f4',
    Success = '#00c851',
    Skip = '#ff8800',
    Error = '#ff4444',
    Message = '#2e2e2e',
    Info = '#33b5e5',
    Warning = '#ffbb33',
    Exception = '#cc0000',
    Subtask = '#2e2e2e',
    List = '#4285f4',
    Dim = '#838584',
}

export enum Badges {
    Default = '',
    Error = '[fail]',
    Skip = '[skip]',
}
