import figures from 'figures';
import stripAnsi from 'strip-ansi';

import { IndicationBadge, IndicationType, Theme } from '../Theme.js';

describe('Theme', (): void => {
  const text = { input: '\\{\\{\\{t\\}e\\}x{red t}\\}', output: '{{{t}e}xt}' };

  it('Default', (): void => {
    const theme = new Theme();

    expect(stripAnsi(theme.paint(text.input, IndicationType.Default))).toBe(text.output);
    expect(stripAnsi(theme.paint(text.input, IndicationType.Success))).toBe(text.output);
    expect(stripAnsi(theme.paint(text.input, IndicationType.Skip))).toBe(text.output);
    expect(stripAnsi(theme.paint(text.input, IndicationType.Error))).toBe(text.output);

    expect(stripAnsi(theme.symbol(IndicationType.Default))).toBe(stripAnsi(figures.pointerSmall));
    expect(stripAnsi(theme.symbol(IndicationType.Success))).toBe(stripAnsi(figures.tick));
    expect(stripAnsi(theme.symbol(IndicationType.Skip))).toBe(stripAnsi(figures.arrowDown));
    expect(stripAnsi(theme.symbol(IndicationType.Error))).toBe(stripAnsi(figures.cross));

    expect(theme.badge(IndicationType.Default)).toBe(IndicationBadge.Default);
    expect(stripAnsi(theme.badge(IndicationType.Skip))).toBe(IndicationBadge.Skip);
    expect(stripAnsi(theme.badge(IndicationType.Error))).toBe(IndicationBadge.Error);
  });

  it('Custom', (): void => {
    const symbol = stripAnsi(figures.star);
    const badge = '[test]';
    const theme = new Theme({
      default: ['#000000', symbol],
      success: { symbol, badge },
      skip: { symbol, badge },
      error: { symbol, badge },
    });

    expect(stripAnsi(theme.paint(text.input, IndicationType.Default))).toBe(text.output);
    expect(stripAnsi(theme.paint(text.input, IndicationType.Success))).toBe(text.output);
    expect(stripAnsi(theme.paint(text.input, IndicationType.Skip))).toBe(text.output);
    expect(stripAnsi(theme.paint(text.input, IndicationType.Error))).toBe(text.output);

    expect(stripAnsi(theme.symbol(IndicationType.Default))).toBe(symbol);
    expect(stripAnsi(theme.symbol(IndicationType.Success))).toBe(symbol);
    expect(stripAnsi(theme.symbol(IndicationType.Skip))).toBe(symbol);
    expect(stripAnsi(theme.symbol(IndicationType.Error))).toBe(symbol);

    expect(theme.badge(IndicationType.Default)).toBe(IndicationBadge.Default);
    expect(stripAnsi(theme.badge(IndicationType.Success))).toBe(badge);
    expect(stripAnsi(theme.badge(IndicationType.Skip))).toBe(badge);
    expect(stripAnsi(theme.badge(IndicationType.Error))).toBe(badge);
  });
});
