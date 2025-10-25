import type { Cell } from "../../types/cell.ts";
import { COLORS } from "../../../../utils/colors.ts";

// TODO: When the algorithm is running, and we are placing block, we need to update the shortest path to not include the wall, if there is no shortest path run again.

class Var {
  gCost: number = 0;
  hCost: number = 0;
  fCost: number = 0;
  parent: Cell | null = null;
}

function calculateHeuristic(a: Cell, b: Cell) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(cell: Cell, grid: Cell[][]) {
  const neigh: Cell[] = []
  const dir = [
    { dx: 0, dy: -1 }, // Up
    { dx: 0, dy: 1 }, // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }, // Right
  ];

  for (const {dx,dy} of dir) {
    const x = cell.x + dx;
    const y = cell.y + dy;
    if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
      if (grid[y][x].state === 'wall') continue;
      neigh.push(grid[y][x]);
    }
  }

  return neigh;
}

async function animatePath(cell: Cell, drawCell: (x: number, y: number, color: number) => void) {
  let temp: Cell | null = cell;

  while (temp !== null) {
    drawCell(temp.x, temp.y, COLORS.path);
    temp = temp.var.parent;

    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

export const aStar = async (grid: Cell[][], startCell: Cell, endCell: Cell, drawCell: (x: number, y: number, color: number) => void) => {
  const openSet: Cell[] = [];
  const closedSet: Set<Cell> = new Set();
  
  startCell.var = new Var();
  startCell.var.hCost = calculateHeuristic(startCell, endCell);
  startCell.var.fCost = startCell.var.hCost;
  openSet.push(startCell);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.var.fCost - b.var.fCost);

    const cell = openSet.shift();
    if (!cell) return;
    closedSet.add(cell);
    drawCell(cell.x, cell.y, COLORS.closedSet);

    if (cell.x === endCell.x && cell.y === endCell.y) {
      await animatePath(cell, drawCell);
      return;
    }

    for (const neigh of getNeighbors(cell, grid)) {
      if (closedSet.has(neigh)) continue;

      const tGCost = cell.var.gCost + 1;
      const nCell = openSet.find((n) => n.x === neigh.x && n.y === neigh.y);

      if (!nCell || tGCost < nCell.var.gCost) {
        neigh.var = new Var();
        neigh.var.gCost = tGCost;
        neigh.var.hCost = calculateHeuristic(neigh, endCell);
        neigh.var.fCost = neigh.var.gCost + neigh.var.hCost;
        neigh.var.parent = cell;

        if (!nCell) {
            openSet.push(neigh);
        }
        
        drawCell(neigh.x, neigh.y, COLORS.openSet);

        const delay = parseInt(localStorage.getItem('delay') || '10');
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
