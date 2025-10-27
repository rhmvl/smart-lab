import { Cell } from "../types/cell";
import { ROWS, COLS } from "./config";

let cachedGrid: Cell[][] | null = null;

// MAYBE MULTI THREADING FOR THIS??

export const getOrCreateGrid = () => {
  if (cachedGrid) return cachedGrid;
  cachedGrid = Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => new Cell(x, y, "empty"))
  );
  return cachedGrid;
};

export const resetGrid = () => {
  cachedGrid = null;
};
