import chalk from 'chalk';
import * as Figures from 'figures';
import { Theme, Color, Figure, Badge } from './types';
import { Type } from './enums';

export class Template {
    private colors: Map<Type, Color> = new Map();
    private figures: Map<Type, Figure> = new Map();
    private badges: Map<Type, Badge> = new Map();

    public constructor(theme?: Theme) {
        if (theme) {
            const { colors, figures, badges } = this;
            const options = new Map(Object.entries(theme));

            Object.values(Type).forEach(
                (key: Type): void => {
                    const option = options.get(key);

                    if (Array.isArray(option)) {
                        const [color, figure, badge] = option;

                        colors.set(key, color);
                        figures.set(key, figure);
                        badges.set(key, badge);
                    }
                }
            );
        }
    }

    private static getValueBy<T>(map: Map<Type, T>, type: Type, getDefault: () => T): T {
        let result = map.get(type);

        if (!result) {
            result = getDefault();
            map.set(type, result);
        }

        return result;
    }

    public paint(str: string, type: Type): Color {
        const { colors } = this;
        const color = Template.getValueBy(
            colors,
            type,
            (): string => {
                if (type === Type.Error) return '#ff5555';
                if (type === Type.Success) return '#008000';
                if (type === Type.Skip) return '#e69500';
                if (type === Type.Info) return '#0000e6';
                if (type === Type.Warning) return '#ffa500';
                if (type === Type.Exception) return '#ff0000';
                if (type === Type.Subtask) return '#bbbbbb';

                return colors.get(Type.Default) || '#ffffff';
            }
        );

        return chalk.hex(color)(str);
    }

    public figure(type: Type): string {
        const { figures } = this;
        const figure = Template.getValueBy(
            figures,
            type,
            (): string => {
                if (type === Type.Error) return Figures.cross;
                if (type === Type.Success) return Figures.tick;
                if (type === Type.Skip) return Figures.arrowDown;
                if (type === Type.Info) return Figures.info;
                if (type === Type.Warning) return Figures.warning;
                if (type === Type.Exception) return Figures.arrowRight;
                if (type === Type.Subtask) return Figures.play;

                return figures.get(Type.Default) || '';
            }
        );

        return this.paint(figure, type);
    }

    public badge(type: Type): Badge {
        const { badges } = this;

        return Template.getValueBy(
            badges,
            type,
            (): string => {
                if (type === Type.Error) return chalk.dim('[fail]');
                if (type === Type.Skip) return chalk.dim('[skip]');

                return badges.get(Type.Default) || '';
            }
        );
    }
}
