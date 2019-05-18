import chalk from 'chalk';
import elegantSpinner from 'elegant-spinner';
import * as Figures from 'figures';
import * as Types from './types';
import * as Enums from './enums';
import { Task } from './task';

const spinner = elegantSpinner();

export class Template {
    public static DELIMITER = '\n';

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

    private static getType(status: Enums.Status, isList: boolean): Enums.Type {
        let type: Enums.Type;

        switch (status) {
            case Enums.Status.Completed:
                type = Enums.Type.Success;
                break;
            case Enums.Status.Skipped:
                type = Enums.Type.Success;
                break;
            case Enums.Status.Failed:
                type = Enums.Type.Success;
                break;
            case Enums.Status.Pending:
            default:
                type = isList ? Enums.Type.List : Enums.Type.Active;
                break;
        }

        return type;
    }

    private static indent(text: string, count: number): string {
        return `${'  '.padStart(2 * count)}${text}`;
    }

    private static getValueBy<T>(map: Map<Enums.Type, T>, type: Enums.Type, getDefault: () => T): T {
        let result = map.get(type);

        if (!result) {
            result = getDefault();
            map.set(type, result);
        }

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
                if (type === Enums.Type.Info) return Figures.info;
                if (type === Enums.Type.Warning) return Figures.warning;
                if (type === Enums.Type.Exception) return Figures.arrowRight;
                if (type === Enums.Type.Subtask) return Figures.play;
                if (type === Enums.Type.List) return Figures.pointer;

                return figures.get(Enums.Type.Default) || '';
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

    public title(task: Task, indent: number): string {
        const prefix = task.isList() ? this.figure(Enums.Type.Subtask) : this.figure(Enums.Type.Default);
        const type = Template.getType(task.getStatus(), task.isList());
        const badge = this.badge(type);
        const figure = this.figure(type);

        return Template.indent(`${prefix}${figure} ${task.getText()}${badge}`, indent);
    }

    public errors(errors: string[], indent: number): string[] {
        const type = Enums.Type.Error;

        return errors.map(
            (error): string => {
                const [title, ...lines] = error.split(Template.DELIMITER);

                return [
                    // FIXME: magic number
                    Template.indent(this.paint(`${this.figure(type)} ${title.trim()}`, type), indent + 4),
                    // FIXME: magic number
                    ...lines.map((line): string => Template.indent(line.trim(), indent + 3)),
                ].join(Template.DELIMITER);
            }
        );
    }

    public messages(list: string[], type: Enums.Type, indent: number): string[] {
        return list.map((value): string => Template.indent(`${this.figure(type)} ${value}`, indent));
    }
}
