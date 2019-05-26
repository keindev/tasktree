import { Type } from './enums';

export type Theme = {
    [key in Type]?:
        | string
        | {
              color?: string;
              symbol?: string;
              badge?: string;
          }
        | [string?, string?, string?]
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
