import { Type } from './enums';

export type Color = string;
export type Figure = string;
export type Badge = string;
export type Theme = { [key in Type]?: [Color, Figure, Badge] };
