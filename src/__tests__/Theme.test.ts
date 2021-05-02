import * as Figures from 'figures';
import stripAnsi from 'strip-ansi';

import { IndicationBadge, IndicationType, Theme } from '../Theme';

describe('Theme', (): void => {
  const text = 'text';

  it('Default', (): void => {
    const theme = new Theme();

    expect(stripAnsi(theme.paint(text, IndicationType.Default))).toBe(text);
    expect(stripAnsi(theme.paint(text, IndicationType.Success))).toBe(text);
    expect(stripAnsi(theme.paint(text, IndicationType.Skip))).toBe(text);
    expect(stripAnsi(theme.paint(text, IndicationType.Error))).toBe(text);

    expect(stripAnsi(theme.symbol(IndicationType.Default))).toBe(stripAnsi(Figures.pointerSmall));
    expect(stripAnsi(theme.symbol(IndicationType.Success))).toBe(stripAnsi(Figures.tick));
    expect(stripAnsi(theme.symbol(IndicationType.Skip))).toBe(stripAnsi(Figures.arrowDown));
    expect(stripAnsi(theme.symbol(IndicationType.Error))).toBe(stripAnsi(Figures.cross));

    expect(theme.badge(IndicationType.Default)).toBe(IndicationBadge.Default);
    expect(stripAnsi(theme.badge(IndicationType.Skip))).toBe(IndicationBadge.Skip);
    expect(stripAnsi(theme.badge(IndicationType.Error))).toBe(IndicationBadge.Error);
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

    expect(stripAnsi(theme.paint(text, IndicationType.Default))).toBe(text);
    expect(stripAnsi(theme.paint(text, IndicationType.Success))).toBe(text);
    expect(stripAnsi(theme.paint(text, IndicationType.Skip))).toBe(text);
    expect(stripAnsi(theme.paint(text, IndicationType.Error))).toBe(text);

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
