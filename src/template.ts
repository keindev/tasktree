import chalk from 'chalk';
import elegantSpinner from 'elegant-spinner';
import * as Figures from 'figures';
import * as Types from './types';
import * as Enums from './enums';
import { Task } from './task';

const spinner = elegantSpinner();

export class Template {
    public static DELIMITER = '\n';
    public static PREFIX = '';
    public static SPACE = ' ';
    public static INDENT = '  ';

    private colors: Map<Enums.Type, Types.Color> = new Map();
    private figures: Map<Enums.Type, Types.Figure> = new Map();
    private badges: Map<Enums.Type, Types.Badge> = new Map();

    public constructor(theme?: Types.Theme) {
        if (theme) {
            const { colors, figures, badges } = this;
            const options = new Map(Object.entries(theme));
            const set = (key: Enums.Type, color?: Types.Color, figure?: Types.Figure, badge?: Types.Badge): void => {
                if (color) colors.set(key, color);
                if (figure) figures.set(key, figure);
                if (badge) badges.set(key, badge);
            };

            Object.values(Enums.Type).forEach(
                (key: Enums.Type): void => {
                    const option = options.get(key);

                    if (Array.isArray(option)) {
                        set(key, ...option);
                    } else if (typeof option === 'object') {
                        const { color, figure, badge } = option;

                        set(key, color, figure, badge);
                    }
                }
            );
        }
    }

    public static join(...text: string[]): string {
        return text.filter((value): boolean => !!value.length).join(Template.SPACE);
    }

    private static getType(status: Enums.Status, isList: boolean): Enums.Type {
        let type: Enums.Type;

        switch (status) {
            case Enums.Status.Completed:
                type = Enums.Type.Success;
                break;
            case Enums.Status.Skipped:
                type = Enums.Type.Skip;
                break;
            case Enums.Status.Failed:
                type = Enums.Type.Error;
                break;
            case Enums.Status.Pending:
            default:
                type = isList ? Enums.Type.List : Enums.Type.Active;
                break;
        }

        return type;
    }

    private static indent(count: number, ...text: string[]): string {
        return `${Template.INDENT.padStart(count * Enums.Indent.Default)}${Template.join(...text)}`;
    }

    private static getValueBy<T>(map: Map<Enums.Type, T>, type: Enums.Type, getDefault: () => T): T {
        let result = map.get(type);

        if (!result) result = getDefault();

        return result;
    }

    public paint(str: string, type: Enums.Type): Types.Color {
        const { colors } = this;
        const color = Template.getValueBy(
            colors,
            type,
            (): string => {
                if (type === Enums.Type.Active) return Enums.Color.Active;
                if (type === Enums.Type.Success) return Enums.Color.Success;
                if (type === Enums.Type.Skip) return Enums.Color.Skip;
                if (type === Enums.Type.Error) return Enums.Color.Error;
                if (type === Enums.Type.Message) return Enums.Color.Message;
                if (type === Enums.Type.Info) return Enums.Color.Info;
                if (type === Enums.Type.Warning) return Enums.Color.Warning;
                if (type === Enums.Type.Exception) return Enums.Color.Exception;
                if (type === Enums.Type.Subtask) return Enums.Color.Subtask;
                if (type === Enums.Type.List) return Enums.Color.List;
                if (type === Enums.Type.Dim) return Enums.Color.Dim;

                return colors.get(Enums.Type.Default) || Enums.Color.Default;
            }
        );

        return color ? chalk.hex(color)(str) : str;
    }

    public figure(type: Enums.Type): Types.Figure {
        const { figures } = this;
        const figure = Template.getValueBy(
            figures,
            type,
            (): string => {
                if (type === Enums.Type.Active) return spinner();
                if (type === Enums.Type.Success) return Figures.tick;
                if (type === Enums.Type.Skip) return Figures.arrowDown;
                if (type === Enums.Type.Error) return Figures.cross;
                if (type === Enums.Type.Message) return Figures.line;
                if (type === Enums.Type.Info) return Figures.info;
                if (type === Enums.Type.Warning) return Figures.warning;
                if (type === Enums.Type.Exception) return Figures.arrowRight;
                if (type === Enums.Type.Subtask) return Figures.play;
                if (type === Enums.Type.List) return Figures.pointer;

                return figures.get(Enums.Type.Default) || this.figure(Enums.Type.Subtask);
            }
        );

        return figure ? this.paint(figure, type) : figure;
    }

    public badge(type: Enums.Type): Types.Badge {
        const { badges } = this;
        const badge = Template.getValueBy(
            badges,
            type,
            (): string => {
                if (type === Enums.Type.Error) return Enums.Badges.Error;
                if (type === Enums.Type.Skip) return Enums.Badges.Skip;

                return badges.get(Enums.Type.Default) || Enums.Badges.Default;
            }
        );

        return badge ? this.paint(badge, Enums.Type.Dim) : badge;
    }

    public title(task: Task, level: number): string {
        const type = Template.getType(task.getStatus(), task.isList());
        const badge = this.badge(type);
        const figure = this.figure(type);
        let prefix = Template.PREFIX;

        if (level) prefix = task.isList() ? this.figure(Enums.Type.Subtask) : this.figure(Enums.Type.Default);

        return Template.indent(level, prefix, figure, task.getText(), badge);
    }

    public errors(errors: string[], level: number): string[] {
        const type = Enums.Type.Error;
        const sublevel = level + Enums.Level.Stride;

        return errors.map(
            (text): string => {
                const [error, ...lines] = text.split(Template.DELIMITER);
                const title = Template.join(this.figure(Enums.Type.Message), this.figure(type), error.trim());

                return [
                    Template.indent(level + Enums.Level.Step, this.paint(title, type)),
                    ...lines.map((line): string => Template.indent(sublevel, this.paint(line.trim(), Enums.Type.Dim))),
                ].join(Template.DELIMITER);
            }
        );
    }

    public messages(list: string[], type: Enums.Type, level: number): string[] {
        const figure = this.figure(type);
        const sign = this.figure(Enums.Type.Message);
        const indent = level + Enums.Level.Step;

        return list.map((text): string => Template.indent(indent, sign, figure, text));
    }
}
