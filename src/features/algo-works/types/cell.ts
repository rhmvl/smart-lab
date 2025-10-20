import { Graphics } from "pixi.js";
import gsap from "gsap";

// Jalur ini sekarang akan benar karena lokasi filenya sudah tepat
import { CELL_SIZE } from "../../../utils/config";
import { COLORS, hexToCss, rgbaToHex } from "../../../utils/colors"

export type CellState = "empty" | "wall" | "start" | "end" | "process";

export class Cell {
  state: CellState;
  x: number;
  y: number;
  graphics: Graphics | null = null;
  var: any|null=null;
  color: number=COLORS.empty;

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
    this.graphics?.clear();
    this.graphics?.fill(color);
    this.graphics?.rect(-CELL_SIZE / 2, -CELL_SIZE / 2, CELL_SIZE - 1, CELL_SIZE - 1);
  }

  drawPop(color: number) {
    this.draw(color);
    if (!this.graphics) return;

    this.graphics.scale.set(0);
    gsap.to(this.graphics.scale, {
      x: 1,
      y: 1,
      duration: 0.65,
      ease: "back.out(1.7)"
    })
  }

  drawFade(color: number) {
    const colorObj = { t: 0 };
    const from = hexToCss(this.color);
    const to = hexToCss(color);

    gsap.to(colorObj, {
      t: 1,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => {
        const current = rgbaToHex(gsap.utils.interpolate(from, to, colorObj.t));
        if (!current) return;
        this.color = current;
        this.draw(current);
      },
    });
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
    this.color = this.getColor();
    this.draw(this.color);
  }
}