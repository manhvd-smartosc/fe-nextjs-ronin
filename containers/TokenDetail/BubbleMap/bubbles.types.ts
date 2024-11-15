import { Text } from 'pixi.js';

export type Circle = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  dragging: boolean;
  targetRadius: number;
  radius: number;
  proportion: number;
  color: string;
  text2: Text | null;
};

export type Data = {
  id: string;
  proportion: number;
};
