import { Type } from './enums';

export type Color = string;
export type Figure = string;
export type Badge = string;
export type Theme = {
    [key in Type]?:
        | {
              color?: Color;
              figure?: Figure;
              badge?: Badge;
          }
        | [Color?, Figure?, Badge?]
};
