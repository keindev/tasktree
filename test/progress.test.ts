import stripAnsi from 'strip-ansi';
import { Progress } from '../src/progress';
import { Theme } from '../src/theme';

describe('Progress', (): void => {
    const $template = ':bar :percent :etas :custom';
    const $theme = new Theme();

    it('Default', (): void => {
        const step = 1;
        const bar = new Progress($template, { total: step * 2 });

        expect(bar.getPercent()).toBe(Progress.MIN_PERCENT);
        expect(bar.getRatio()).toBe(Progress.MIN_RATIO);
        expect(bar.getStart()).toBeTruthy();
        expect(bar.getEnd()).toBeFalsy();
        expect(bar.getElapsed()).toBeTruthy();
        expect(bar.getRate()).toBeFalsy();
        expect(bar.getETA()).toBe(Infinity);
        expect(bar.isCompleted()).toBeFalsy();

        bar.tick();

        expect(bar.getPercent()).toBe(Progress.MAX_PERCENT / 2);
        expect(bar.getRatio()).toBe(Progress.MAX_RATIO / 2);
        expect(bar.getStart()).toBeTruthy();
        expect(bar.getEnd()).toBeFalsy();
        expect(bar.getElapsed()).toBeTruthy();
        expect(bar.getRate()).toBeTruthy();
        expect(bar.getETA()).toBeTruthy();
        expect(bar.isCompleted()).toBeFalsy();

        bar.tick(step, {
            custom: 'test',
        });

        expect(bar.getPercent()).toBe(Progress.MAX_PERCENT);
        expect(bar.getRatio()).toBe(Progress.MAX_RATIO);
        expect(bar.getStart()).toBeTruthy();
        expect(bar.getEnd()).toBeTruthy();
        expect(bar.getElapsed()).toBeTruthy();
        expect(bar.getRate()).toBeTruthy();
        expect(bar.getETA()).toBeFalsy();
        expect(bar.isCompleted()).toBeTruthy();
        expect(stripAnsi(bar.render($theme))).toMatchSnapshot();
    });

    describe('Statuses', (): void => {
        let $bar: Progress;
        let $before: number;

        beforeEach((): void => {
            $bar = new Progress($template);
            $before = new Date().getTime();

            $bar.tick($bar.total / 2);
        });

        afterEach((): void => {
            expect($bar.isCompleted()).toBeTruthy();
            expect($bar.getEnd()).toBeGreaterThanOrEqual($before);
            expect($bar.getEnd()).toBeLessThanOrEqual(new Date().getTime());
        });

        it('Complete', (): void => {
            $bar.complete();

            expect($bar.getPercent()).toBe(Progress.MAX_PERCENT);
            expect(stripAnsi($bar.render($theme))).toMatchSnapshot();
        });

        it('Skip', (): void => {
            $bar.skip();

            expect($bar.getPercent()).toBe(Progress.MAX_PERCENT / 2);
            expect(stripAnsi($bar.render($theme))).toMatchSnapshot();
        });

        it('Fail', (): void => {
            $bar.fail();

            expect($bar.getPercent()).toBe(Progress.MAX_PERCENT / 2);
            expect(stripAnsi($bar.render($theme))).toMatchSnapshot();
        });
    });
});
