import chalk from 'chalk';
import elegantSpinner from 'elegant-spinner';
import * as Figures from 'figures';
import { Terminal } from 'stdout-update/lib/Terminal';

import { ProgressBar } from './ProgressBar';
import { Task, TaskStatus } from './Task';

const frame = elegantSpinner();

export enum IndicationType {
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

export enum IndicationColor {
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

export enum IndicationBadge {
  Default = '',
  Error = '[fail]',
  Skip = '[skip]',
}

export enum Indent {
  Default = 2,
  Long = 3,
  Empty = 0,
}

export enum TextSeparator {
  Empty = '',
  Space = ' ',
}

export interface IGradient {
  position: number;
  begin: IndicationType;
  end: IndicationType;
}

export type ThemeOptions = {
  [key in IndicationType]?:
    | string
    | {
        color?: string;
        symbol?: string;
        badge?: string;
      }
    | [string?, string?, string?];
};

export class Theme {
  public static INDENT = '  ';

  private colors: Map<IndicationType, string> = new Map();
  private symbols: Map<IndicationType, string> = new Map();
  private badges: Map<IndicationType, string> = new Map();

  public constructor(options?: ThemeOptions) {
    if (options) {
      const { colors, symbols, badges } = this;
      const list = new Map(Object.entries(options));
      const set = (key: IndicationType, color?: string, symbol?: string, badge?: string): void => {
        if (color) colors.set(key, color);
        if (symbol) symbols.set(key, symbol);
        if (badge) badges.set(key, badge);
      };

      Object.values(IndicationType).forEach((key: IndicationType): void => {
        const option = list.get(key);

        if (Array.isArray(option)) {
          set(key, ...option);
        } else if (typeof option === 'string') {
          colors.set(key, option);
        } else if (typeof option === 'object') {
          const { color, symbol, badge } = option;

          set(key, color, symbol, badge);
        }
      });
    }
  }

  public static type(status: TaskStatus, isList = false): IndicationType {
    let type: IndicationType;

    switch (status) {
      case TaskStatus.Completed:
        type = IndicationType.Success;
        break;
      case TaskStatus.Skipped:
        type = IndicationType.Skip;
        break;
      case TaskStatus.Failed:
        type = IndicationType.Error;
        break;
      case TaskStatus.Pending:
      default:
        type = isList ? IndicationType.List : IndicationType.Active;
        break;
    }

    return type;
  }

  public static join(separator: string, ...text: string[]): string {
    return text.filter((value): boolean => !!value.length).join(separator);
  }

  public static dye(str: string, color: string): string {
    return color ? chalk.hex(color)(str) : str;
  }

  public static indent(count: number, ...text: string[]): string {
    return `${Theme.INDENT.padStart(count * Indent.Default)}${Theme.join(TextSeparator.Space, ...text)}`;
  }

  public static format(template: string): string {
    return template ? chalk(Object.assign([], { raw: [template.replace(/`/g, '\\`')] })) : '';
  }

  private static getValueBy<T>(map: Map<IndicationType, T>, type: IndicationType, getDefault: () => T): T {
    let result = map.get(type);

    if (!result) result = getDefault();

    return result;
  }

  private static hex([r, g, b]: [number, number, number]): string {
    const int = ((Math.round(r) & 0xff) << 16) + ((Math.round(g) & 0xff) << 8) + (Math.round(b) & 0xff);
    const str = int.toString(16).toUpperCase();

    return '000000'.substring(str.length) + str;
  }

  private static rgb(color: string): [number, number, number] {
    const match = color.match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    let r = 0;
    let g = 0;
    let b = 0;

    if (match) {
      const int = parseInt(
        match[0]
          .split('')
          .map((char) => char + char)
          .join(''),
        16
      );

      r = (int >> 16) & 0xff;
      g = (int >> 8) & 0xff;
      b = int & 0xff;
    }

    return [r, g, b];
  }

  public getColor(type: IndicationType): string {
    const { colors } = this;

    return Theme.getValueBy(this.colors, type, (): string => {
      if (type === IndicationType.Active) return IndicationColor.Active;
      if (type === IndicationType.Success) return IndicationColor.Success;
      if (type === IndicationType.Skip) return IndicationColor.Skip;
      if (type === IndicationType.Error) return IndicationColor.Error;
      if (type === IndicationType.Message) return IndicationColor.Message;
      if (type === IndicationType.Info) return IndicationColor.Info;
      if (type === IndicationType.Warning) return IndicationColor.Warning;
      if (type === IndicationType.Subtask) return IndicationColor.Subtask;
      if (type === IndicationType.List) return IndicationColor.List;
      if (type === IndicationType.Dim) return IndicationColor.Dim;

      return colors.get(IndicationType.Default) || IndicationColor.Default;
    });
  }

  public paint(str: string, type: IndicationType): string {
    return Theme.dye(Theme.format(str), this.getColor(type));
  }

  public gradient(str: string, gradient: IGradient): string {
    const begin = Theme.rgb(this.getColor(gradient.begin));
    const end = Theme.rgb(this.getColor(gradient.end));
    const w = gradient.position * 2 - 1;
    const w1 = (w + 1) / 2.0;
    const w2 = 1 - w1;

    return Theme.dye(
      str,
      Theme.hex([
        Math.round(end[0] * w1 + begin[0] * w2),
        Math.round(end[1] * w1 + begin[1] * w2),
        Math.round(end[2] * w1 + begin[2] * w2),
      ])
    );
  }

  public symbol(type: IndicationType): string {
    const { symbols } = this;
    const symbol = Theme.getValueBy(symbols, type, (): string => {
      if (type === IndicationType.Active) return frame();
      if (type === IndicationType.Success) return Figures.tick;
      if (type === IndicationType.Skip) return Figures.arrowDown;
      if (type === IndicationType.Error) return Figures.cross;
      if (type === IndicationType.Message) return Figures.line;
      if (type === IndicationType.Info) return Figures.info;
      if (type === IndicationType.Warning) return Figures.warning;
      if (type === IndicationType.Subtask) return Figures.pointerSmall;
      if (type === IndicationType.List) return Figures.pointer;

      return symbols.get(IndicationType.Default) || this.symbol(IndicationType.Subtask);
    });

    return symbol ? this.paint(symbol, type) : symbol;
  }

  public badge(type: IndicationType): string {
    const { badges } = this;
    const badge = Theme.getValueBy(badges, type, (): string => {
      if (type === IndicationType.Error) return IndicationBadge.Error;
      if (type === IndicationType.Skip) return IndicationBadge.Skip;

      return badges.get(IndicationType.Default) || IndicationBadge.Default;
    });

    return badge ? this.paint(badge, IndicationType.Dim) : badge;
  }

  public title(task: Task, level: number): string {
    const type = Theme.type(task.status, task.haveSubtasks);
    const badge = this.badge(type);
    const symbol = this.symbol(type);
    let prefix: string = TextSeparator.Empty;

    if (level) prefix = task.haveSubtasks ? this.symbol(IndicationType.Subtask) : this.symbol(IndicationType.Default);

    return Theme.indent(level, prefix, symbol, task.text, badge);
  }

  public errors(errors: string[], level: number): string[] {
    const type = IndicationType.Error;
    const sublevel = level + Indent.Long;

    return errors.reduce<string[]>((acc, text): string[] => {
      const [error, ...lines] = text.split(Terminal.EOL);
      const title = Theme.join(
        TextSeparator.Space,
        this.symbol(IndicationType.Message),
        this.symbol(type),
        error.trim()
      );

      return acc.concat([
        Theme.indent(level + 1, this.paint(title, type)),
        ...lines.map((line): string => Theme.indent(sublevel, this.paint(line.trim(), IndicationType.Dim))),
      ]);
    }, []);
  }

  public messages(list: string[], type: IndicationType, level: number): string[] {
    const symbol = this.symbol(type);
    const sign = this.symbol(IndicationType.Message);
    const indent = level + 1;

    return list.map((text): string => Theme.indent(indent, sign, symbol, text));
  }

  public bars(list: ProgressBar[], level: number): string[] {
    const symbol = this.symbol(IndicationType.Subtask);

    return list
      .filter((bar): boolean => !bar.isCompleted || !bar.clear)
      .map((bar): string => Theme.indent(level, symbol, bar.render(this)));
  }
}
