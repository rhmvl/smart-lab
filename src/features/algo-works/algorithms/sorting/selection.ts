import type { RefObject } from "react";
import { Bar } from "../../../../types/bar";

export const selectionSort = async (
  bars: Bar[],
  swapBars: (i: number, j: number) => Promise<void>,
  render: (active?: number[], swap?: number[], done?: boolean) => void,
  delay: () => number,
  isSortingRef: RefObject<boolean>
) => {
  const n = bars.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (!isSortingRef.current) return;

      render([i, j, minIdx]);
      await new Promise((r) => setTimeout(r, delay()));

      if (bars[j].value < bars[minIdx].value) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      await swapBars(i, minIdx);
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

