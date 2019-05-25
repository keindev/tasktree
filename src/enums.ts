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

export enum Progress {
    Default = -1,
    Start = 0,
    End = 100,
}

export enum Token {
    // the progress bar itself
    Bar = ':bar',
    // current tick number
    Current = ':current',
    // total ticks
    Total = ':total',
    // time elapsed in seconds
    Elapsed = ':elapsed',
    // completion percentage
    Percent = ':percent',
    // estimated completion time in seconds
    ETA = ':eta',
    // rate of ticks per second
    Rate = ':rate',
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
    Subtask = '#2e2e2e',
    List = '#4285f4',
    Dim = '#838584',
}

export enum Badge {
    Default = '',
    Error = '[fail]',
    Skip = '[skip]',
}
