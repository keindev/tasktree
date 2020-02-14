import { Wrapper } from 'stdout-update/lib/wrapper';
import * as Figures from 'figures';
import { Theme, IndicationType } from './Theme';
import { TaskStatus } from './Task';

export enum Progress {
    Default = -1,
    Start = 0,
    End = 100,
}

export enum TemplateToken {
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

export interface IProgressBarOptions {
    // current completed index
    current?: number;
    // total number of ticks to complete
    total?: number;
    // the displayed width of the progress bar defaulting to total
    width?: number;
    // completion character
    complete?: string;
    // incomplete character
    incomplete?: string;
    // option to clear the bar on completion
    clear?: boolean;
    // option to add badge
    badges?: boolean;
    // option to add gradient to pending bar
    gradient?: boolean;
}

export interface IProgressBarToken {
    [key: string]: string;
}

export class ProgressBar {
    public static TICK = 1;
    public static TIME_DIMENSION = 1000;
    public static MAX_POINT_POSITION = 1;
    public static MIN_POINT_POSITION = 0;
    public static MIN_PERCENT = 0;
    public static MAX_PERCENT = 100;
    public static MIN_RATIO = 0;
    public static MAX_RATIO = 1;

    public readonly total = Progress.End;
    public readonly completeBlock = Figures.square;
    public readonly incompleteBlock = Figures.square;
    public readonly width: number = 20;
    public readonly clear: boolean = false;
    public readonly badges: boolean = true;
    public readonly gradient: boolean = true;
    public readonly template: string;

    private current = Progress.Start;
    private start = new Date().getTime();
    private end: number | undefined;
    private status = TaskStatus.Pending;
    private tokens: Map<TemplateToken | string, string> = new Map();

    public constructor(template?: string, options?: IProgressBarOptions) {
        this.template =
            template ||
            Theme.join(
                Wrapper.SPACE,
                TemplateToken.Bar,
                `${TemplateToken.Rate}/bps`,
                TemplateToken.Percent,
                `${TemplateToken.ETA}s`
            );

        if (typeof options === 'object') {
            if (options.current) this.current = options.current;
            if (options.total) this.total = options.total;
            if (options.width) this.width = options.width;
            if (options.complete) this.completeBlock = options.complete;
            if (options.incomplete) this.incompleteBlock = options.incomplete;

            this.clear = !!options.clear;
        }
    }

    public getRatio(): number {
        return Math.min(Math.max(this.current / this.total, ProgressBar.MIN_RATIO), ProgressBar.MAX_RATIO);
    }

    public getPercent(): number {
        return Math.floor(this.getRatio() * ProgressBar.MAX_PERCENT);
    }

    public getElapsed(): number {
        return (this.end || new Date().getTime()) - this.start;
    }

    public getRate(): number {
        return this.current / (this.getElapsed() / ProgressBar.TIME_DIMENSION);
    }

    public getETA(): number {
        return this.getPercent() === ProgressBar.MAX_PERCENT
            ? ProgressBar.MIN_PERCENT
            : this.getElapsed() * (this.total / this.current - ProgressBar.MAX_RATIO);
    }

    public getStart(): number {
        return this.start;
    }

    public getEnd(): number | undefined {
        return this.end;
    }

    public isCompleted(): boolean {
        return this.current >= this.total || !!this.end;
    }

    public tick(step?: number, tokens?: IProgressBarToken): ProgressBar {
        this.current = Math.min(this.total, this.current + (step || ProgressBar.TICK));
        this.tokens = typeof tokens === 'object' ? new Map(Object.entries(tokens)) : new Map();

        if (this.isCompleted()) this.complete();

        return this;
    }

    public complete(): void {
        this.current = this.total;
        this.status = TaskStatus.Completed;
        this.end = new Date().getTime();
    }

    public skip(): void {
        if (!this.isCompleted()) {
            this.status = TaskStatus.Skipped;
            this.end = new Date().getTime();
        }
    }

    public fail(): void {
        if (!this.isCompleted()) {
            this.status = TaskStatus.Failed;
            this.end = new Date().getTime();
        }
    }

    public render(theme: Theme): string {
        const length = Math.round(this.width * this.getRatio());
        const type = Theme.type(this.status);

        let result = this.template
            .replace(TemplateToken.Current, this.current.toString())
            .replace(TemplateToken.Total, this.total.toString())
            .replace(TemplateToken.Percent, `${this.getPercent().toFixed(ProgressBar.MIN_POINT_POSITION)}%`)
            .replace(
                TemplateToken.ETA,
                (this.getETA() / ProgressBar.TIME_DIMENSION).toFixed(ProgressBar.MAX_POINT_POSITION)
            )
            .replace(TemplateToken.Rate, Math.round(this.getRate()).toString())
            .replace(
                TemplateToken.Elapsed,
                (this.getElapsed() / ProgressBar.TIME_DIMENSION).toFixed(ProgressBar.MAX_POINT_POSITION)
            )
            .replace(
                TemplateToken.Bar,
                Theme.join(
                    Wrapper.EMPTY,
                    this.getBlocks(theme, type, length),
                    theme.paint(
                        Wrapper.EMPTY.padStart(this.width - length, this.incompleteBlock),
                        IndicationType.Subtask
                    )
                )
            );

        this.tokens.forEach((value: string, key: string): void => {
            result = result.replace(`:${key}`, value);
        });

        return this.badges ? Theme.join(Wrapper.SPACE, result, theme.badge(type)) : result;
    }

    private getBlocks(theme: Theme, type: IndicationType, length: number): string {
        let blocks = Wrapper.EMPTY.padStart(length, this.completeBlock);

        if (!this.isCompleted() && this.gradient) {
            blocks = theme.gradient(blocks, {
                position: this.getRatio(),
                begin: Theme.type(this.status),
                end: IndicationType.Success,
            });
        } else {
            blocks = theme.paint(blocks, type);
        }

        return blocks;
    }
}
