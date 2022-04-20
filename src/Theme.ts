import chalkTemplate from 'chalk-template';
import elegantSpinner from 'elegant-spinner';
import figures from 'figures';
import { Terminal } from 'stdout-update/lib/Terminal';

import { ProgressBar } from './ProgressBar.js';
import { Task, TaskStatus } from './Task.js';

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
  begin: IndicationType;
  end: IndicationType;
  position: number;
}

export type ThemeOptions = {
  [key in IndicationType]?: string | { badge?: string; color?: string; symbol?: string } | [string?, string?, string?];
};

export class Theme {
  static INDENT = '  ';

  #badges: Map<IndicationType, string> = new Map();
  #colors: Map<IndicationType, string> = new Map();
  #symbols: Map<IndicationType, string> = new Map();

  constructor(options?: ThemeOptions) {
    if (options) {
      const list = new Map(Object.entries(options));
      const set = (key: IndicationType, color?: string, symbol?: string, badge?: string): void => {
        if (color) this.#colors.set(key, color);
        if (symbol) this.#symbols.set(key, symbol);
        if (badge) this.#badges.set(key, badge);
      };

      Object.values(IndicationType).forEach((key: IndicationType): void => {
        const option = list.get(key);

        if (Array.isArray(option)) {
          set(key, ...option);
        } else if (typeof option === 'string') {
          this.#colors.set(key, option);
        } else if (typeof option === 'object') {
          const { color, symbol, badge } = option;

          set(key, color, symbol, badge);
        }
      });
    }
  }

  static dye(str: string, color?: string): string {
    return color ? chalkTemplate`{hex('${color}') ${str}}` : str;
  }

  static format(template: string): string {
    return template ? chalkTemplate(Object.assign([], { raw: [template] })) : '';
  }

  static indent(count: number, ...text: string[]): string {
    return `${Theme.INDENT.padStart(count * Indent.Default)}${Theme.join(TextSeparator.Space, ...text)}`;
  }

  static join(separator: string, ...text: string[]): string {
    return text.filter((value): boolean => !!value?.length).join(separator);
  }

  static type(status: TaskStatus, isList = false): IndicationType {
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

  private static getValueBy<T>(map: Map<IndicationType, T>, type: IndicationType, getDefault: () => T): T {
    let result = map.get(type);

    if (!result) result = getDefault();

    return result;
  }

  private static hex([r, g, b]: [number, number, number]): string {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const int = ((Math.round(r) & 0xff) << 16) + ((Math.round(g) & 0xff) << 8) + (Math.round(b) & 0xff);
    const str = int.toString(16).toUpperCase();

    return '000000'.substring(str.length) + str;
  }

  private static rgb(color: string): [number, number, number] {
    const match = color.match(/[\da-f]{6}|[\da-f]{3}/i);
    let rgb: [number, number, number] = [0, 0, 0];

    if (match && match[0]) {
      const int = parseInt(
        match[0]
          .split('')
          .map(char => char + char)
          .join(''),
        16
      );

      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      rgb = [(int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff];
    }

    return rgb;
  }

  badge(type: IndicationType): string {
    const badge = Theme.getValueBy(this.#badges, type, () => {
      if (type === IndicationType.Error) return IndicationBadge.Error;
      if (type === IndicationType.Skip) return IndicationBadge.Skip;

      return this.#badges.get(IndicationType.Default) || IndicationBadge.Default;
    });

    return badge ? this.paint(badge, IndicationType.Dim) : badge;
  }

  bars(list: ProgressBar[], level: number): string[] {
    const symbol = this.symbol(IndicationType.Subtask);

    return list
      .filter((bar): boolean => !bar.isCompleted || !bar.clear)
      .map((bar): string => Theme.indent(level, symbol, bar.render(this)));
  }

  errors(errors: string[], level: number): string[] {
    const type = IndicationType.Error;
    const sublevel = level + Indent.Long;

    return errors.reduce<string[]>((acc, text): string[] => {
      const [error = '', ...lines] = text.split(Terminal.EOL);
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

  getColor(type: IndicationType): string {
    return Theme.getValueBy(this.#colors, type, (): string => {
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

      return this.#colors.get(IndicationType.Default) || IndicationColor.Default;
    });
  }

  gradient(str: string, gradient: IGradient): string {
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

  messages(list: string[], type: IndicationType, level: number): string[] {
    const symbol = this.symbol(type);
    const sign = this.symbol(IndicationType.Message);
    const indent = level + 1;

    return list.map((text): string => Theme.indent(indent, sign, symbol, text));
  }

  paint(str: string, type: IndicationType): string {
    return Theme.dye(Theme.format(str), this.getColor(type));
  }

  symbol(type: IndicationType): string {
    const symbol = Theme.getValueBy(this.#symbols, type, () => {
      if (type === IndicationType.Active) return frame();
      if (type === IndicationType.Success) return figures.tick;
      if (type === IndicationType.Skip) return figures.arrowDown;
      if (type === IndicationType.Error) return figures.cross;
      if (type === IndicationType.Message) return figures.line;
      if (type === IndicationType.Info) return figures.info;
      if (type === IndicationType.Warning) return figures.warning;
      if (type === IndicationType.Subtask) return figures.pointerSmall;
      if (type === IndicationType.List) return figures.pointer;

      return this.#symbols.get(IndicationType.Default) || this.symbol(IndicationType.Subtask);
    });

    return symbol ? this.paint(symbol, type) : symbol;
  }

  title(task: Task, level: number): string {
    const type = Theme.type(task.status, task.haveSubtasks);
    const badge = this.badge(type);
    const symbol = this.symbol(type);
    let prefix: string = TextSeparator.Empty;

    if (level) prefix = task.haveSubtasks ? this.symbol(IndicationType.Subtask) : this.symbol(IndicationType.Default);

    return Theme.indent(level, prefix, symbol, task.text, badge);
  }
}
