import * as Figures from 'figures';
import stripAnsi from 'strip-ansi';
import { Template } from '../src/template';
import { Type, Badges } from '../src/enums';

describe('Template', (): void => {
    describe('Creating', (): void => {
        it('Default', (): void => {
            const text = 'text';
            const { length } = text;
            const template = new Template();

            expect(template.paint(text, Type.Default).length).toBe(length);
            expect(template.paint(text, Type.Success).length).toBeGreaterThanOrEqual(length);
            expect(template.paint(text, Type.Skip).length).toBeGreaterThanOrEqual(length);
            expect(template.paint(text, Type.Error).length).toBeGreaterThanOrEqual(length);

            expect(stripAnsi(template.figure(Type.Default))).toBe(Figures.play);
            expect(stripAnsi(template.figure(Type.Success))).toBe(stripAnsi(Figures.tick));
            expect(stripAnsi(template.figure(Type.Skip))).toBe(stripAnsi(Figures.arrowDown));
            expect(stripAnsi(template.figure(Type.Error))).toBe(stripAnsi(Figures.cross));

            expect(template.badge(Type.Default)).toBe(Badges.Default);
            expect(stripAnsi(template.badge(Type.Skip))).toBe(Badges.Skip);
            expect(stripAnsi(template.badge(Type.Error))).toBe(Badges.Error);
        });

        it('Custom', (): void => {
            const text = 'text';
            const { length } = text;
            const color = '#000000';
            const figure = stripAnsi(Figures.star);
            const badge = '[test]';
            const template = new Template({
                default: [color, figure],
                success: { figure, badge },
                skip: { figure, badge },
                error: { figure, badge },
            });

            expect(template.paint(text, Type.Default).length).toBeGreaterThanOrEqual(length);
            expect(template.paint(text, Type.Success).length).toBeGreaterThanOrEqual(length);
            expect(template.paint(text, Type.Skip).length).toBeGreaterThanOrEqual(length);
            expect(template.paint(text, Type.Error).length).toBeGreaterThanOrEqual(length);

            expect(stripAnsi(template.figure(Type.Default))).toBe(figure);
            expect(stripAnsi(template.figure(Type.Success))).toBe(figure);
            expect(stripAnsi(template.figure(Type.Skip))).toBe(figure);
            expect(stripAnsi(template.figure(Type.Error))).toBe(figure);

            expect(template.badge(Type.Default)).toBe(Badges.Default);
            expect(stripAnsi(template.badge(Type.Success))).toBe(badge);
            expect(stripAnsi(template.badge(Type.Skip))).toBe(badge);
            expect(stripAnsi(template.badge(Type.Error))).toBe(badge);
        });
    });
});
