import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { Application, extend } from "@pixi/react";
import { Cell, type CellState } from "../../../types/cell.ts";
import { COLORS } from "../../../utils/colors.ts";
import { CELL_SIZE, COLS, ROWS } from "../../../utils/config.ts";
import { eventBus } from "../../../utils/eventBus.ts";
import { aStar } from "../algorithms/astar.ts";

extend({Container, Graphics});

const createGrid = (): Cell[][] =>
  Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => new Cell(x, y, 'empty'))
  );

export const CanvasLayer = () => {
  const [grid] = useState<Cell[][]>(createGrid);
  const mouseDown = useRef(false);
  const mouseType = useRef(false); // false: left, true: right;
  let running = false;

  const startCell = useRef<Cell | null>(null);
  const endCell = useRef<Cell | null>(null);

  const updateCell = useCallback((x: number, y: number, state: CellState) => {
    const cell = grid[y][x];

    if (cell.state === state) return;
    switch (state) {
      case "start":
        if (startCell !== null) startCell.current?.updateState('empty');
        startCell.current = cell
        break;
      case "end":
        if (endCell !== null) endCell.current?.updateState('empty');
        endCell.current = cell;
        break;
    }

    cell.updateState(state);
    cell.drawPop(cell.color);
  }, [grid]);

  const drawCell = useCallback((x: number, y: number, color: number) => {
    if (grid[y][x].state === 'empty')
      grid[y][x].drawFade(color);
  }, [grid]);

  const updateVisual = useCallback(() => {
    // TODO: Maybe there is a better way for performace.
    grid.map((row) => {
      row.map((cell) => cell.updateState(cell.state))
    })
  }, [grid]);

  const handlePointer = useCallback((e: FederatedPointerEvent) => {
      if (!mouseDown.current || e.pointerType !== "mouse") return;
      
      if (e.button === 2) mouseType.current = true;
      else if (e.button === 0) mouseType.current = false;

      const x = Math.floor(e.global.x / CELL_SIZE);
      const y = Math.floor(e.global.y / CELL_SIZE);
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
      
      if (mouseType.current) {
        updateCell(x, y, 'empty');
        return;
      }
      
      const block = localStorage.getItem('block') as CellState;
      updateCell(x, y, block);
    },
    [updateCell]
  );

  useEffect(() => {
    const handleUp = () => (mouseDown.current = false);
    const offRun = () => (running = !running);

    updateVisual(); // Update the grid visual on startup.

    eventBus.on("toggle_run", offRun);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    return () => {
      window.removeEventListener("pointerup", handleUp);
      eventBus.off("toggle_run", offRun);
    }
  }, []);

  useEffect(() => {
    const handler = async () => {
      updateVisual();
      if (running || !startCell.current || !endCell.current) return;
      running = true;
      await aStar(grid, startCell.current, endCell.current, drawCell);
      running = false;
    };

    eventBus.on("run_algo", handler);

    return () => {
      eventBus.off("run_algo", handler);
    }
  }, [grid, startCell, endCell, drawCell]);

  return (
    <pixiContainer eventMode="static"
      onPointerDown={(e: FederatedPointerEvent) => {
      mouseDown.current = true;
      handlePointer(e);
    }}
    onPointerMove={handlePointer}
    onPointerUp={() => (mouseDown.current = false)}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <pixiGraphics
            key={`${x}-${y}`}
            x={x * CELL_SIZE + CELL_SIZE / 2}
            y={y * CELL_SIZE + CELL_SIZE / 2}
            draw={(g) => {
              cell.setGraphics(g);
              cell.updateState(cell.state);
            }}
          />
        ))
      )}
    </pixiContainer>
  );
}

export const Grid = () => {
  return (
    <Application
      width={ROWS * CELL_SIZE}
      height={COLS * CELL_SIZE}
      backgroundColor={COLORS.background}
    >
      <CanvasLayer />
    </Application>
  )
}
