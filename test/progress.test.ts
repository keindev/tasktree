import stripAnsi from 'strip-ansi';
import { Progress } from '../src/progress';
import { Theme } from '../src/theme';

const tpl = ':bar :percent :etas :custom';
const theme = new Theme();

describe('Progress', (): void => {
    it('Default', (): void => {
        const step = 1;
        const bar = new Progress(tpl, { total: step * 2 });

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
        expect(stripAnsi(bar.render(theme))).toMatchSnapshot();
    });

    describe('Statuses', (): void => {
        it('Complete', (): void => {
            const bar = new Progress(tpl);
            const before = new Date().getTime();

            bar.complete();

            const after = new Date().getTime();

            expect(bar.isCompleted()).toBeTruthy();
            expect(bar.getEnd()).toBeGreaterThanOrEqual(before);
            expect(bar.getEnd()).toBeLessThanOrEqual(after);
            expect(bar.getPercent()).toBe(Progress.MAX_PERCENT);
            expect(stripAnsi(bar.render(theme))).toMatchSnapshot();
        });

        it('Skip', (): void => {
            const bar = new Progress(tpl);
            const before = new Date().getTime();

            bar.tick(bar.total / 2);
            bar.fail();

            const after = new Date().getTime();

            expect(bar.isCompleted()).toBeTruthy();
            expect(bar.getEnd()).toBeGreaterThanOrEqual(before);
            expect(bar.getEnd()).toBeLessThanOrEqual(after);
            expect(bar.getPercent()).toBe(Progress.MAX_PERCENT / 2);
            expect(stripAnsi(bar.render(theme))).toMatchSnapshot();
        });

        it('Fail', (): void => {
            const bar = new Progress(tpl);
            const before = new Date().getTime();

            bar.tick(bar.total / 2);
            bar.skip();

            const after = new Date().getTime();

            expect(bar.isCompleted()).toBeTruthy();
            expect(bar.getEnd()).toBeGreaterThanOrEqual(before);
            expect(bar.getEnd()).toBeLessThanOrEqual(after);
            expect(bar.getPercent()).toBe(Progress.MAX_PERCENT / 2);
            expect(stripAnsi(bar.render(theme))).toMatchSnapshot();
        });
    });
});
