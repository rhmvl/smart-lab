import { Graphics } from "pixi.js";
import gsap from "gsap";
import { COLORS } from "../utils/colors.ts";

export class Bar {
  index: number;
  value: number;
  width: number=0;
  height: number=0;
  graphics: Graphics | null = null;

  constructor(index: number, value: number) {
    this.index = index;
    this.value = value;
  }

  setGraphics(g: Graphics) {
    if (this.graphics === g) return;
    this.graphics = g;
  }

  draw(color: number = COLORS.primary) {
    if (!this.graphics) return;
    const g = this.graphics;

    const barWidth = this.width;
    const barHeight = this.height;

    g.fill(color);
    g.roundRect(0, 0, barWidth * 0.9, barHeight, 4);
  }

  animateSwap(targetIndex: number, duration = 0.25) {
    if (!this.graphics) return;
    const targetX = targetIndex * this.width;
    gsap.to(this.graphics, {
      x: targetX,
      duration,
      ease: "power2.out",
    });
  }

  clone(): Bar {
    const c = new Bar(this.index, this.value);
    c.graphics = this.graphics;
    c.width = this.width;
    c.height = this.height;
    return c;
  }
}

