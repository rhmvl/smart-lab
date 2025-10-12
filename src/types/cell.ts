import type { Graphics } from "pixi.js";
import { CELL_SIZE } from "../config";
import { COLORS } from "../utils/colors";

export type CellState = "empty" | "wall" | "start" | "end" | "process";

export class Cell {
  state: CellState;
  x: number;
  y: number;
  graphics: Graphics | null = null;

  constructor (x: number, y: number, state: CellState) {
    this.x = x;
    this.y = y;
    this.state = state;
  }

  setGraphics(g: Graphics) {
    if (this.graphics === g) return;
    this.graphics = g;
  }

  draw(color: number) {
    // this.graphics?.clear();
    this.graphics?.fill(color);
    // this.graphics?.rect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
    this.graphics?.rect(0, 0, CELL_SIZE - 1, CELL_SIZE - 1);
  }

  clone(): Cell {
    const c = new Cell(this.x, this.y, this.state);
    c.graphics = this.graphics;
    return c;
  }

  getColor(): number {
    switch (this.state) {
      case 'start': return COLORS.start;
      case 'end': return COLORS.end;
      case 'wall': return COLORS.wall;
      default: return COLORS.empty;
    }
  }

  updateState(state: CellState) {
    this.state = state;
    this.draw(this.getColor());
  }
}
