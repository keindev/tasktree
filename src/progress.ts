import { Wrapper } from 'stdout-update/lib/wrapper';
import * as Figures from 'figures';
import * as Enums from './enums';
import { Theme } from './theme';
import { Options, Token } from './types';

export class Progress {
    public static TICK = 1;
    public static TIME_DIMENSION = 1000;
    public static MAX_POINT_POSITION = 1;
    public static MIN_POINT_POSITION = 0;
    public static MIN_PERCENT = 0;
    public static MAX_PERCENT = 100;
    public static MIN_RATIO = 0;
    public static MAX_RATIO = 1;

    public readonly total = Enums.Progress.End;
    public readonly completeBlock = Figures.square;
    public readonly incompleteBlock = Figures.square;
    public readonly width: number = 20;
    public readonly clear: boolean = false;
    public readonly badges: boolean = true;
    public readonly gradient: boolean = true;
    public readonly template: string;

    private current = Enums.Progress.Start;
    private start = new Date().getTime();
    private end: number | undefined;
    private status = Enums.Status.Pending;
    private tokens: Map<Enums.Token | string, string> = new Map();

    public constructor(template?: string, options?: Options) {
        this.template =
            template ||
            Theme.join(
                Wrapper.SPACE,
                Enums.Token.Bar,
                `${Enums.Token.Rate}/bps`,
                Enums.Token.Percent,
                `${Enums.Token.ETA}s`
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
        return Math.min(Math.max(this.current / this.total, Progress.MIN_RATIO), Progress.MAX_RATIO);
    }

    public getPercent(): number {
        return Math.floor(this.getRatio() * Progress.MAX_PERCENT);
    }

    public getElapsed(): number {
        return (this.end || new Date().getTime()) - this.start;
    }

    public getRate(): number {
        return this.current / (this.getElapsed() / Progress.TIME_DIMENSION);
    }

    public getETA(): number {
        return this.getPercent() === Progress.MAX_PERCENT
            ? Progress.MIN_PERCENT
            : this.getElapsed() * (this.total / this.current - Progress.MAX_RATIO);
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

    public tick(step?: number, tokens?: Token): Progress {
        this.current = Math.min(this.total, this.current + (step || Progress.TICK));
        this.tokens = typeof tokens === 'object' ? new Map(Object.entries(tokens)) : new Map();

        if (this.isCompleted()) this.complete();

        return this;
    }

    public complete(): void {
        this.current = this.total;
        this.status = Enums.Status.Completed;
        this.end = new Date().getTime();
    }

    public skip(): void {
        if (!this.isCompleted()) {
            this.status = Enums.Status.Skipped;
            this.end = new Date().getTime();
        }
    }

    public fail(): void {
        if (!this.isCompleted()) {
            this.status = Enums.Status.Failed;
            this.end = new Date().getTime();
        }
    }

    public render(theme: Theme): string {
        const length = Math.round(this.width * this.getRatio());
        const type = Theme.type(this.status);
        let blocks = Wrapper.EMPTY.padStart(length, this.completeBlock);

        if (!this.isCompleted() && this.gradient) {
            blocks = theme.gradient(blocks, {
                position: this.getRatio(),
                begin: Theme.type(this.status),
                end: Enums.Type.Success,
            });
        } else {
            blocks = theme.paint(blocks, type);
        }

        let result = this.template
            .replace(Enums.Token.Current, this.current.toString())
            .replace(Enums.Token.Total, this.total.toString())
            .replace(Enums.Token.Percent, `${this.getPercent().toFixed(Progress.MIN_POINT_POSITION)}%`)
            .replace(Enums.Token.ETA, (this.getETA() / Progress.TIME_DIMENSION).toFixed(Progress.MAX_POINT_POSITION))
            .replace(Enums.Token.Rate, Math.round(this.getRate()).toString())
            .replace(
                Enums.Token.Elapsed,
                (this.getElapsed() / Progress.TIME_DIMENSION).toFixed(Progress.MAX_POINT_POSITION)
            )
            .replace(
                Enums.Token.Bar,
                Theme.join(
                    Wrapper.EMPTY,
                    blocks,
                    theme.paint(Wrapper.EMPTY.padStart(this.width - length, this.incompleteBlock), Enums.Type.Subtask)
                )
            );

        this.tokens.forEach((value: string, key: string): void => {
            result = result.replace(`:${key}`, value);
        });

        return this.badges ? Theme.join(Wrapper.SPACE, result, theme.badge(type)) : result;
    }
}
