import { Graphics } from 'pixi.js';
import * as CONFIG from '../config';
import { COLORS } from '../utils/colors';

export type CellState = 'empty' | 'start' | 'end' | 'wall';

export class Cell {
  x: number; // Column index
  y: number; // Row index
  state: CellState;
  graphics: Graphics | null = null;

  constructor(y: number, x: number, state: CellState = 'empty') {
    this.y = y; // Row
    this.x = x; // Col
    this.state = state;
  }

  getColor(): number {
    switch (this.state) {
      case 'start': return COLORS.start;
      case 'end': return COLORS.end;
      case 'wall': return COLORS.wall;
      default: return COLORS.empty;
    }
  }

  setState(state: CellState) {
    if (this.state === state) return;
    this.state = state;
  }

  draw(color: number) {
    const x = this.x * CONFIG.CELL_SIZE;
    const y = this.y * CONFIG.CELL_SIZE;
    const size = CONFIG.CELL_SIZE - 1;

    this.graphics?.fill({ color: color });
    this.graphics?.rect(x, y, size, size);
  }

  update(state: CellState) {
    this.setState(state);
    this.draw(this.getColor());
  }
}
