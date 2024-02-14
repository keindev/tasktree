import figures from 'figures';

import { TaskStatus } from './Task.js';
import { IndicationType, TextSeparator, Theme } from './Theme.js';

/** Progress in percent by default */
export enum Progress {
  Default = -1,
  Start = 0,
  End = 100,
}

/** ProgressBar output template */
export enum TemplateToken {
  /** The progress bar itself */
  Bar = ':bar',
  /** Current tick number */
  Current = ':current',
  /** Total ticks */
  Total = ':total',
  /**  */
  // Time elapsed in seconds
  Elapsed = ':elapsed',
  /** Completion percentage */
  Percent = ':percent',
  /** Estimated completion time in seconds */
  ETA = ':eta',
  /** Rate of ticks per second */
  Rate = ':rate',
}

/** ProgressBar display options */
export interface IProgressBarOptions {
  /** Option to add badge */
  badges?: boolean;
  /** Option to clear the bar on completion */
  clear?: boolean;
  /** Completion character */
  completeChar?: string;
  /** Current completed index */
  current?: number;
  /** Option to add gradient to pending bar */
  gradient?: boolean;
  /** Incomplete character */
  incompleteChar?: string;
  /** Total number of ticks to complete */
  total?: number;
  /** The displayed width of the progress bar defaulting to total */
  width?: number;
}

/** User template tokens values */
export interface IProgressBarToken {
  [key: string]: string;
}

/**
 * To add a Progress Bar to your task, use {@link Task.bar}  method accepting the string pattern and progress bar parameters.
 *
 * ```javascript
 * const progress = new task.bar([template, options]);
 * ```
 */
export class ProgressBar implements Required<Omit<IProgressBarOptions, 'current'>> {
  static readonly MAX_PERCENT = 100;
  static readonly MAX_POINT_POSITION = 1;
  static readonly MAX_RATIO = 1;
  static readonly MIN_PERCENT = 0;
  static readonly MIN_POINT_POSITION = 0;
  static readonly MIN_RATIO = 0;
  static readonly TICK = 1;
  static readonly TIME_DIMENSION = 1000;

  /** Option to add badge */
  readonly badges: boolean = true;
  /** Option to clear the bar on completion */
  readonly clear: boolean = false;
  /** Completion character */
  readonly completeChar = figures.square;
  /** Option to add gradient to pending bar */
  readonly gradient: boolean = true;
  /** Incomplete character */
  readonly incompleteChar = figures.square;
  /**
   * Output template
   *
   * @default `:bar :rate/bps :percent :eta/s`
   */
  readonly template: string;
  /** Total number of ticks to complete */
  readonly total = Progress.End;
  /** The displayed width of the progress bar defaulting to total */
  readonly width: number = 20;

  #current = Progress.Start;
  #end: number | undefined;
  readonly #start = new Date().getTime();
  #status = TaskStatus.Pending;
  #tokens: Map<TemplateToken | string, string> = new Map();

  constructor(template?: string, options?: IProgressBarOptions) {
    this.template =
      template ||
      Theme.join(
        TextSeparator.Empty,
        TemplateToken.Bar,
        `${TemplateToken.Rate}/bps`,
        TemplateToken.Percent,
        `${TemplateToken.ETA}s`
      );

    if (typeof options === 'object') {
      if (options.current) this.#current = options.current;
      if (options.total) this.total = options.total;
      if (options.width) this.width = options.width;
      if (options.completeChar) this.completeChar = options.completeChar;
      if (options.incompleteChar) this.incompleteChar = options.incompleteChar;

      this.clear = !!options.clear;
    }
  }

  /** Ratio between `current` value and `total` value */
  get ratio(): number {
    return Math.min(Math.max(this.#current / this.total, ProgressBar.MIN_RATIO), ProgressBar.MAX_RATIO);
  }

  /** Current percent of completion */
  get percent(): number {
    return Math.floor(this.ratio * ProgressBar.MAX_PERCENT);
  }

  /** Elapsed time from the beginning of progress, in milliseconds */
  get elapsed(): number {
    return (this.#end || new Date().getTime()) - this.#start;
  }

  /** Rate of progress */
  get rate(): number {
    return this.#current / (this.elapsed / ProgressBar.TIME_DIMENSION);
  }

  /** Progress ETA (estimated time of arrival) */
  get ETA(): number {
    return this.percent === ProgressBar.MAX_PERCENT
      ? ProgressBar.MIN_PERCENT
      : this.elapsed * (this.total / this.#current - ProgressBar.MAX_RATIO);
  }

  /** Start `Date` in milliseconds */
  get start(): number {
    return this.#start;
  }

  /** End `Date` in milliseconds if progress is an ended */
  get end(): number | undefined {
    return this.#end;
  }

  /** `true` if progress is complete */
  get isCompleted(): boolean {
    return this.#current >= this.total || !!this.#end;
  }

  /** Completes progress and marks it as successful */
  complete(): void {
    this.#current = this.total;
    this.#status = TaskStatus.Completed;
    this.#end = new Date().getTime();
  }

  /** Stops the progress and marks it as failed */
  fail(): void {
    if (!this.isCompleted) {
      this.#status = TaskStatus.Failed;
      this.#end = new Date().getTime();
    }
  }

  /** Render output string with Theme */
  render(theme: Theme): string {
    const length = Math.round(this.width * this.ratio);
    const type = Theme.type(this.#status);

    let result = this.template
      .replace(TemplateToken.Current, this.#current.toString())
      .replace(TemplateToken.Total, this.total.toString())
      .replace(TemplateToken.Percent, `${this.percent.toFixed(ProgressBar.MIN_POINT_POSITION)}%`)
      .replace(TemplateToken.ETA, (this.ETA / ProgressBar.TIME_DIMENSION).toFixed(ProgressBar.MAX_POINT_POSITION))
      .replace(TemplateToken.Rate, Math.round(this.rate).toString())
      .replace(
        TemplateToken.Elapsed,
        (this.elapsed / ProgressBar.TIME_DIMENSION).toFixed(ProgressBar.MAX_POINT_POSITION)
      )
      .replace(
        TemplateToken.Bar,
        Theme.join(
          TextSeparator.Empty,
          this.getBlocks(theme, type, length),
          theme.paint(TextSeparator.Empty.padStart(this.width - length, this.incompleteChar), IndicationType.Subtask)
        )
      );

    this.#tokens.forEach((value: string, key: string): void => {
      result = result.replace(`:${key}`, value);
    });

    return this.badges ? Theme.join(TextSeparator.Space, result, theme.badge(type)) : result;
  }

  /** Stops the progress and marks it as skipped */
  skip(): void {
    if (!this.isCompleted) {
      this.#status = TaskStatus.Skipped;
      this.#end = new Date().getTime();
    }
  }

  /**
   * Increases current progress on step value
   * @param step - Value by which the current progress will increase
   * @param tokens - Add custom tokens by adding a `{'name': value}` object parameter to your method
   * @example
   * ```javascript
   * const bar = new Progress(':bar template with custom :token');
   *
   * bat.tick(10, { token: 100 });
   * ```
   */
  tick(step?: number, tokens?: IProgressBarToken): ProgressBar {
    this.#current = Math.min(this.total, this.#current + (step || ProgressBar.TICK));
    this.#tokens = typeof tokens === 'object' ? new Map(Object.entries(tokens)) : new Map();

    if (this.isCompleted) this.complete();

    return this;
  }

  private getBlocks(theme: Theme, type: IndicationType, length: number): string {
    const str = TextSeparator.Empty.padStart(length, this.completeChar);

    return !this.isCompleted && this.gradient
      ? theme.gradient(str, { position: this.ratio, begin: Theme.type(this.#status), end: IndicationType.Success })
      : theme.paint(str, type);
  }
}
