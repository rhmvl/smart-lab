import type { RefObject } from "react";
import { Bar } from "../../../../types/bar";

export const bubbleSort = async (
  bars: Bar[],
  swapBars: (i: number, j: number) => Promise<void>,
  render: (active?: number[], swap?: number[], done?: boolean) => void,
  delay: () => number,
  isSortingRef: RefObject<boolean>
) => {
  const n = bars.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!isSortingRef.current) return;

      render([j, j + 1]); 
      await new Promise((r) => setTimeout(r, delay()));

      if (bars[j].value > bars[j + 1].value) {
        swapBars(j, j + 1);
      }
    }
  }

  if (isSortingRef.current) {
    for (let i = 0; i < n; i++) {
      if (!isSortingRef.current) return;
      render([], [i]);
      await new Promise((r) => setTimeout(r, Math.max(10, 50)));
    }

    render([], [], true);
    isSortingRef.current = false;
  }
};
