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

    public readonly total: number = Enums.Progress.End;
    public readonly width: number = 20;
    public readonly completeBlock: string = Figures.square;
    public readonly incompleteBlock: string = Theme.SPACE;
    public readonly headBlock: string = '|';
    public readonly clear: boolean = false;
    public readonly template: string;

    private current: number = Enums.Progress.Start;
    private start: number = new Date().getTime();
    private tokens: Map<string, string> = new Map();

    public constructor(template?: string, options?: Options) {
        this.template =
            template || Theme.join(Enums.Token.Bar, `${Enums.Token.Rate}/bps`, Enums.Token.Percent, Enums.Token.ETA);

        if (typeof options === 'object') {
            if (options.current) this.current = options.current;
            if (options.total) this.total = options.total;
            if (options.width) this.width = options.width;
            if (options.complete) this.completeBlock = options.complete;
            if (options.incomplete) this.incompleteBlock = options.incomplete;
            if (options.head) this.headBlock = options.head;

            this.clear = !!options.clear;
        }
    }

    public tick(step?: number, tokens?: Token): boolean {
        const { total } = this;

        this.current = Math.min(total, this.current + (step || Progress.TICK));
        this.tokens = typeof tokens === 'object' ? new Map(Object.entries(tokens)) : new Map();

        return this.current >= total;
    }

    public complete(): void {
        this.current = this.total;
    }

    public getRatio(): number {
        return Math.min(Math.max(this.current / this.total, Progress.MAX_RATIO), Progress.MAX_RATIO);
    }

    public getPercent(): number {
        return Math.floor(this.getRatio() * Progress.MAX_PERCENT);
    }

    public getElapsed(): number {
        return new Date().getTime() - this.start;
    }

    public getRate(): number {
        return this.current / (this.getElapsed() / Progress.TIME_DIMENSION);
    }

    public getETA(): number {
        return this.getPercent() === Progress.MAX_PERCENT
            ? Progress.MIN_PERCENT
            : this.getElapsed() * (this.total / this.current - Progress.MAX_RATIO);
    }

    public render(theme: Theme): string {
        const elapsed = this.getElapsed() / Progress.TIME_DIMENSION;
        const eta = this.getETA() / Progress.TIME_DIMENSION;
        const length = Math.round(this.width * this.getRatio());
        const complete = theme.paint(Array(length).join(this.completeBlock), Enums.Type.Success);
        const incomplete = theme.paint(Array(this.width - length).join(this.incompleteBlock), Enums.Type.Dim);
        let result = this.template
            .replace(Enums.Token.Current, this.current.toString())
            .replace(Enums.Token.Total, this.total.toString())
            .replace(Enums.Token.Elapsed, elapsed.toFixed(Progress.MAX_POINT_POSITION))
            .replace(Enums.Token.ETA, eta.toFixed(Progress.MAX_POINT_POSITION))
            .replace(Enums.Token.Percent, `${this.getPercent().toFixed(Progress.MIN_POINT_POSITION)}%`)
            .replace(Enums.Token.Rate, Math.round(this.getRate()).toString())
            .replace(Enums.Token.Bar, [complete, incomplete].join(this.headBlock));

        this.tokens.forEach(
            (value: string, key: string): void => {
                result = result.replace(`:${key}`, value);
            }
        );

        return result;
    }
}
