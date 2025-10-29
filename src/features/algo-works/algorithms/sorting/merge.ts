import type { RefObject } from "react";
import { Bar } from "../../../../types/bar";

export const mergeSort = async (
  bars: Bar[],
  swapBars: (i: number, j: number, directSet?: boolean) => Promise<void>,
  render: (active?: number[], swap?: number[], done?: boolean) => void,
  delay: () => number,
  isSortingRef: RefObject<boolean>,
  left = 0,
  right = bars.length - 1
) => {
  if (left >= right || !isSortingRef.current) return;

  const merge = async (l: number, m: number, r: number) => {
    const leftArr = bars.slice(l, m + 1).map(b => ({ ...b }));
    const rightArr = bars.slice(m + 1, r + 1).map(b => ({ ...b }));

    let i = 0, j = 0, k = l;

    while (i < leftArr.length && j < rightArr.length) {
      if (!isSortingRef.current) return;

      render([k]);
      await new Promise((r) => setTimeout(r, delay()));

      if (leftArr[i].value <= rightArr[j].value) {
        bars[k].value = leftArr[i].value;
        i++;
      } else {
        bars[k].value = rightArr[j].value;
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      if (!isSortingRef.current) return;
      bars[k++].value = leftArr[i++].value;
      render([k]);
      await new Promise((r) => setTimeout(r, delay()));
    }

    while (j < rightArr.length) {
      if (!isSortingRef.current) return;
      bars[k++].value = rightArr[j++].value;
      render([k]);
      await new Promise((r) => setTimeout(r, delay()));
    }
  };

  const mid = Math.floor((left + right) / 2);
  await mergeSort(bars, swapBars, render, delay, isSortingRef, left, mid);
  await mergeSort(bars, swapBars, render, delay, isSortingRef, mid + 1, right);
  await merge(left, mid, right);

  if (left === 0 && right === bars.length - 1 && isSortingRef.current) {
    for (let i = 0; i < bars.length; i++) {
      render([], [i]);
      await new Promise((r) => setTimeout(r, 30));
    }
    render([], [], true);
    isSortingRef.current = false;
  }
};
