import chalk from 'chalk';
import * as Figures from 'figures';
import * as Types from './types';
import * as Enums from './enums';

export class Template {
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
                if (type === Enums.Type.Error) return Enums.Color.Error;
                if (type === Enums.Type.Success) return Enums.Color.Success;
                if (type === Enums.Type.Skip) return Enums.Color.Skip;
                if (type === Enums.Type.Info) return Enums.Color.Info;
                if (type === Enums.Type.Warning) return Enums.Color.Warning;
                if (type === Enums.Type.Exception) return Enums.Color.Exception;
                if (type === Enums.Type.Subtask) return Enums.Color.Subtask;

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
                if (type === Enums.Type.Error) return Figures.cross;
                if (type === Enums.Type.Success) return Figures.tick;
                if (type === Enums.Type.Skip) return Figures.arrowDown;
                if (type === Enums.Type.Info) return Figures.info;
                if (type === Enums.Type.Warning) return Figures.warning;
                if (type === Enums.Type.Exception) return Figures.arrowRight;
                if (type === Enums.Type.Subtask) return Figures.play;

                return figures.get(Enums.Type.Default) || '';
            }
        );

        return this.paint(figure, type);
    }

    public badge(type: Enums.Type): Types.Badge {
        const { badges } = this;

        return Template.getValueBy(
            badges,
            type,
            (): string => {
                if (type === Enums.Type.Error) return chalk.dim(Enums.Badges.Error);
                if (type === Enums.Type.Skip) return chalk.dim(Enums.Badges.Skip);

                return badges.get(Enums.Type.Default) || Enums.Badges.Default;
            }
        );
    }
}
