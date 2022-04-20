import stripAnsi from 'strip-ansi';

import { IProgressBarOptions, ProgressBar } from '../ProgressBar.js';
import { Theme } from '../Theme.js';

describe('ProgressBar', (): void => {
  const template = ':bar :percent :etas :custom';
  const theme = new Theme();
  const options: IProgressBarOptions = { completeChar: '*', incompleteChar: '_' };
  const step = 1;
  const half = 2;
  let bar: ProgressBar;
  let before: number;

  it('Default', (): void => {
    bar = new ProgressBar(template, { total: step * half, ...options });

    expect(bar.percent).toBe(ProgressBar.MIN_PERCENT);
    expect(bar.ratio).toBe(ProgressBar.MIN_RATIO);
    expect(bar.start).toBeTruthy();
    expect(bar.end).toBeFalsy();
    expect(bar.rate).toBeFalsy();
    expect(isFinite(bar.ETA)).toBeFalsy();
    expect(bar.isCompleted).toBeFalsy();

    bar.tick();

    expect(bar.percent).toBe(ProgressBar.MAX_PERCENT / half);
    expect(bar.ratio).toBe(ProgressBar.MAX_RATIO / half);
    expect(bar.start).toBeTruthy();
    expect(bar.end).toBeFalsy();
    expect(bar.elapsed).toBeTruthy();
    expect(bar.rate).toBeTruthy();
    expect(bar.ETA).toBeTruthy();
    expect(bar.isCompleted).toBeFalsy();

    bar.tick(step, { custom: 'test' });

    expect(bar.percent).toBe(ProgressBar.MAX_PERCENT);
    expect(bar.ratio).toBe(ProgressBar.MAX_RATIO);
    expect(bar.start).toBeTruthy();
    expect(bar.end).toBeTruthy();
    expect(bar.elapsed).toBeTruthy();
    expect(bar.rate).toBeTruthy();
    expect(bar.ETA).toBeFalsy();
    expect(bar.isCompleted).toBeTruthy();
    expect(stripAnsi(bar.render(theme))).toMatchSnapshot();
  });

  describe('Statuses', (): void => {
    beforeEach((): void => {
      bar = new ProgressBar(template, options);
      before = new Date().getTime();
      bar.tick(bar.total / half);
    });

    it('Complete', (): void => {
      bar.complete();

      expect(bar.percent).toBe(ProgressBar.MAX_PERCENT);
      expect(stripAnsi(bar.render(theme))).toMatchSnapshot();
      expect(bar.isCompleted).toBeTruthy();
      expect(bar.end).toBeGreaterThanOrEqual(before);
      expect(bar.end).toBeLessThanOrEqual(new Date().getTime());
    });

    it('Skip', (): void => {
      bar.skip();

      expect(bar.percent).toBe(ProgressBar.MAX_PERCENT / half);
      expect(stripAnsi(bar.render(theme))).toMatchSnapshot();
    });

    it('Fail', (): void => {
      bar.fail();

      expect(bar.percent).toBe(ProgressBar.MAX_PERCENT / half);
      expect(stripAnsi(bar.render(theme))).toMatchSnapshot();
    });
  });
});
