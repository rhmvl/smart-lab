import { bubbleSort } from "./sorting/bubble";
import { selectionSort } from "./sorting/selection";
import { insertionSort } from "./sorting/insertion";
import { quickSort } from "./sorting/quick";
import { mergeSort } from "./sorting/merge";

import { Bar } from "../../../types/bar";
import { type RefObject } from 'react';
import type { Cell } from "../types/cell";
import { aStar } from "./pathfinding/astar";

type DrawCell = (x: number, y: number, color: number) => void;

export const runSortingAlgorithm = async (
  algorithm: string,
  bars: Bar[],
  swapBars: (i: number, j: number) => Promise<void>,
  render: (active?: number[], swap?: number[], done?: boolean) => void,
  delay: () => number,
  isSortingRef: RefObject<boolean>
) => {
  switch (algorithm) {
    case "bubble":
      await bubbleSort(bars, swapBars, render, delay, isSortingRef);
      break;
    case "selection":
      await selectionSort(bars, swapBars, render, delay, isSortingRef);
      break;
    case "insertion":
      await insertionSort(bars, swapBars, render, delay, isSortingRef);
      break;
    case "quick":
      await quickSort(bars, swapBars, render, delay, isSortingRef);
      break;
    case "merge":
      await mergeSort(bars, swapBars, render, delay, isSortingRef);
      break;
    default:
      console.warn("Unknown sorting algorithm:", algorithm);
      break;
  }
};

export const runPathfindingAlgorithm = async (
  algorithm: string,
  grid: Cell[][],
  startCell: RefObject<Cell | null>,
  endCell: RefObject<Cell | null>,
  drawCell: DrawCell
) => {
  // Persist last used algorithm
  localStorage.setItem("path-algorithm", algorithm);

  if (!startCell.current || !endCell.current) {
    alert("Start cell or end cell is not placed!");
    return;
  }

  const algorithms = {
    astar: aStar,
    // dijkstra: dijkstra,
    // bfs: bfs,
    // dfs: dfs,
  };

  const runAlgo = algorithms[algorithm as keyof typeof algorithms];
  if (!runAlgo) {
    console.warn("Unknown pathfinding algorithm:", algorithm);
    alert("Unknown algorithm selected!");
    return;
  }

  try {
    await runAlgo(grid, startCell.current, endCell.current, drawCell);
  } catch (error) {
    console.error("Pathfinding error:", error);
  }
};

