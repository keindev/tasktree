import * as Figures from 'figures';
import * as Enums from './enums';
import { Template } from './template';

export interface Options {
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
}

export class Progress {
    public readonly total: number = Enums.Progress.End;
    public readonly width: number = 100;
    public readonly completeBlock: string = Figures.square;
    public readonly incompleteBlock: string = Template.SPACE;
    public readonly clear: boolean = false;
    public readonly template: string;

    private current: number = Enums.Progress.Start;

    public constructor(template?: string, options?: Options) {
        this.template =
            template ||
            Template.join(Enums.Tokens.Bar, `${Enums.Tokens.Rate}/bps`, Enums.Tokens.Percent, Enums.Tokens.ETA);

        if (typeof options === 'object') {
            if (options.current) this.current = options.current;
            if (options.total) this.total = options.total;
            if (options.width) this.width = options.width;
            if (options.complete) this.completeBlock = options.complete;
            if (options.incomplete) this.incompleteBlock = options.incomplete;

            this.clear = !!options.clear;
        }
    }

    public tick(value: number): boolean {
        const { total } = this;

        this.current = Math.min(total, this.current + value);

        return this.current >= total;
    }

    public getTick(): number {
        return this.current;
    }

    public complete(): void {
        this.current = this.total;
    }
}
