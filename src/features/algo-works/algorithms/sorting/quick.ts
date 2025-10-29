import type { RefObject } from "react";
import { Bar } from "../../../../types/bar";

export const quickSort = async (
  bars: Bar[],
  swapBars: (i: number, j: number) => Promise<void>,
  render: (active?: number[], swap?: number[], done?: boolean) => void,
  delay: () => number,
  isSortingRef: RefObject<boolean>,
  left = 0,
  right = bars.length - 1
) => {
  if (left >= right || !isSortingRef.current) return;

  const partition = async (low: number, high: number): Promise<number> => {
    const pivot = bars[high].value;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (!isSortingRef.current) return high;

      render([j, high]);
      await new Promise((r) => setTimeout(r, delay()));

      if (bars[j].value < pivot) {
        i++;
        await swapBars(i, j);
      }
    }

    await swapBars(i + 1, high);
    return i + 1;
  };

  const pi = await partition(left, right);
  await quickSort(bars, swapBars, render, delay, isSortingRef, left, pi - 1);
  await quickSort(bars, swapBars, render, delay, isSortingRef, pi + 1, right);

  if (left === 0 && right === bars.length - 1 && isSortingRef.current) {
    for (let i = 0; i < bars.length; i++) {
      render([], [i]);
      await new Promise((r) => setTimeout(r, 30));
    }
    render([], [], true);
    isSortingRef.current = false;
  }
};
