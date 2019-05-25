import * as Figures from 'figures';
import stripAnsi from 'strip-ansi';
import { Theme } from '../src/theme';
import { Type, Badge } from '../src/enums';

describe('Theme', (): void => {
    describe('Creating', (): void => {
        it('Default', (): void => {
            const text = 'text';
            const { length } = text;
            const theme = new Theme();

            expect(theme.paint(text, Type.Default).length).toBe(length);
            expect(theme.paint(text, Type.Success).length).toBeGreaterThanOrEqual(length);
            expect(theme.paint(text, Type.Skip).length).toBeGreaterThanOrEqual(length);
            expect(theme.paint(text, Type.Error).length).toBeGreaterThanOrEqual(length);

            expect(stripAnsi(theme.symbol(Type.Default))).toBe(Figures.pointerSmall);
            expect(stripAnsi(theme.symbol(Type.Success))).toBe(stripAnsi(Figures.tick));
            expect(stripAnsi(theme.symbol(Type.Skip))).toBe(stripAnsi(Figures.arrowDown));
            expect(stripAnsi(theme.symbol(Type.Error))).toBe(stripAnsi(Figures.cross));

            expect(theme.badge(Type.Default)).toBe(Badge.Default);
            expect(stripAnsi(theme.badge(Type.Skip))).toBe(Badge.Skip);
            expect(stripAnsi(theme.badge(Type.Error))).toBe(Badge.Error);
        });

        it('Custom', (): void => {
            const text = 'text';
            const { length } = text;
            const color = '#000000';
            const symbol = stripAnsi(Figures.star);
            const badge = '[test]';
            const theme = new Theme({
                default: [color, symbol],
                success: { symbol, badge },
                skip: { symbol, badge },
                error: { symbol, badge },
            });

            expect(theme.paint(text, Type.Default).length).toBeGreaterThanOrEqual(length);
            expect(theme.paint(text, Type.Success).length).toBeGreaterThanOrEqual(length);
            expect(theme.paint(text, Type.Skip).length).toBeGreaterThanOrEqual(length);
            expect(theme.paint(text, Type.Error).length).toBeGreaterThanOrEqual(length);

            expect(stripAnsi(theme.symbol(Type.Default))).toBe(symbol);
            expect(stripAnsi(theme.symbol(Type.Success))).toBe(symbol);
            expect(stripAnsi(theme.symbol(Type.Skip))).toBe(symbol);
            expect(stripAnsi(theme.symbol(Type.Error))).toBe(symbol);

            expect(theme.badge(Type.Default)).toBe(Badge.Default);
            expect(stripAnsi(theme.badge(Type.Success))).toBe(badge);
            expect(stripAnsi(theme.badge(Type.Skip))).toBe(badge);
            expect(stripAnsi(theme.badge(Type.Error))).toBe(badge);
        });
    });
});
