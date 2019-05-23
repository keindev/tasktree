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

export interface Token {
    [key: string]: string;
}

export interface Options {
    // current completed index
    current?: number;
    // total number of ticks to complete
    total?: number;
    // the displayed width of the progress bar defaulting to total
    width?: number;
    // completion character
    complete?: string;
    // incomplete character
    incomplete?: string;
    // option to clear the bar on completion
    clear?: boolean;
    // option to add badge
    badges?: boolean;
    // option to add gradient to pending bar
    gradient?: boolean;
}

export interface Gradient {
    position: number;
    begin: Type;
    end: Type;
}
