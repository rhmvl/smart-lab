import type { RefObject } from "react";
import { Bar } from "../../../../types/bar";

export const insertionSort = async (
  bars: Bar[],
  swapBars: (i: number, j: number) => Promise<void>,
  render: (active?: number[], swap?: number[], done?: boolean) => void,
  delay: () => number,
  isSortingRef: RefObject<boolean>
) => {
  const n = bars.length;

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && bars[j - 1].value > bars[j].value) {
      if (!isSortingRef.current) return;

      render([j - 1, j]);
      await new Promise((r) => setTimeout(r, delay()));
      await swapBars(j - 1, j);
      j--;
    }
  }

  if (isSortingRef.current) {
    for (let i = 0; i < n; i++) {
      render([], [i]);
      await new Promise((r) => setTimeout(r, Math.max(10, 50)));
    }
    render([], [], true);
    isSortingRef.current = false;
  }
};
