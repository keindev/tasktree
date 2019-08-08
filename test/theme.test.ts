import * as Figures from 'figures';
import stripAnsi from 'strip-ansi';
import { Theme } from '../src/theme';
import { Type, Badge } from '../src/enums';

describe('Theme', (): void => {
    const $text = 'text';

    it('Default', (): void => {
        const theme = new Theme();

        expect(stripAnsi(theme.paint($text, Type.Default))).toBe($text);
        expect(stripAnsi(theme.paint($text, Type.Success))).toBe($text);
        expect(stripAnsi(theme.paint($text, Type.Skip))).toBe($text);
        expect(stripAnsi(theme.paint($text, Type.Error))).toBe($text);

        expect(stripAnsi(theme.symbol(Type.Default))).toBe(stripAnsi(Figures.pointerSmall));
        expect(stripAnsi(theme.symbol(Type.Success))).toBe(stripAnsi(Figures.tick));
        expect(stripAnsi(theme.symbol(Type.Skip))).toBe(stripAnsi(Figures.arrowDown));
        expect(stripAnsi(theme.symbol(Type.Error))).toBe(stripAnsi(Figures.cross));

        expect(theme.badge(Type.Default)).toBe(Badge.Default);
        expect(stripAnsi(theme.badge(Type.Skip))).toBe(Badge.Skip);
        expect(stripAnsi(theme.badge(Type.Error))).toBe(Badge.Error);
    });

    it('Custom', (): void => {
        const symbol = stripAnsi(Figures.star);
        const badge = '[test]';
        const theme = new Theme({
            default: ['#000000', symbol],
            success: { symbol, badge },
            skip: { symbol, badge },
            error: { symbol, badge },
        });

        expect(stripAnsi(theme.paint($text, Type.Default))).toBe($text);
        expect(stripAnsi(theme.paint($text, Type.Success))).toBe($text);
        expect(stripAnsi(theme.paint($text, Type.Skip))).toBe($text);
        expect(stripAnsi(theme.paint($text, Type.Error))).toBe($text);

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
