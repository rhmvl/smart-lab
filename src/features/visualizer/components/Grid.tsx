import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { Application, extend, useApplication } from "@pixi/react";
import { Cell, type CellState } from "../types/cell.ts";
import { aStar } from "../algorithms/astar.ts";
import { eventBus } from "../../utils/eventBus.ts";
import { COLORS } from "../../utils/colors.ts";
import { CELL_SIZE, COLS, ROWS } from "../../utils/config.ts";

extend({Container, Graphics});

const createGrid = (): Cell[][] =>
  Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => new Cell(x, y, 'empty'))
  );

export const CanvasLayer = () => {
  const { app } = useApplication(); // Do not delete this variable, even tough unused.
  const [grid, _] = useState<Cell[][]>(createGrid);
  const [tick, __] = useState(false);
  const [v, ___] = useState(false);
  const mouseDown = useRef(false);
  const [isRunning, setRunning] = useState(false);

  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [endCell, setEndCell] = useState<Cell | null>(null);

  const updateCell = useCallback((x: number, y: number) => {
    const cell = grid[y][x];
    const block = localStorage.getItem('block') as CellState;

    if (block === 'start') {
      if (startCell !== null) startCell.updateState('empty');
      setStartCell(cell); // TODO: LocalStorage
    }
    if (block === 'end') {
      if (endCell !== null) endCell.updateState('empty');
      setEndCell(cell); // TODO: LocalStorage
    }
    cell.updateState(block);
    cell.drawPop(cell.color);
  }, [grid, startCell, endCell, tick]); // ALSO THIS.

  const drawCell = useCallback((x: number, y: number, color: number) => {
    if (grid[y][x].state === 'empty')
      grid[y][x].drawFade(color);
  }, [grid, tick]);

  const clearVisual = useCallback(() => {
    // TODO.
  }, []);

  const handlePointer = useCallback(
    (e: FederatedPointerEvent) => {
      if (!mouseDown.current) return;
      const x = Math.floor(e.global.x / CELL_SIZE);
      const y = Math.floor(e.global.y / CELL_SIZE);
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
      updateCell(x, y);
    },
    [updateCell]
  );

  useEffect(() => {
    const handleUp = () => (mouseDown.current = false);
    window.addEventListener("mouseup", handleUp);
    return () => window.removeEventListener("mouseup", handleUp);
  }, []);

  useEffect(() => {
    const handler = () => {
      clearVisual();
      // console.log("Algorithm is runned");
      if (!startCell || !endCell) return;
      aStar(grid, startCell, endCell, drawCell);
    };

    eventBus.on("run_algo", handler);

    return () => {
      eventBus.off("run_algo", handler);
    }
  }, [grid, startCell, endCell, drawCell]);

  return (
    <pixiContainer eventMode="static" key={`${v}`}
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
            key={`${x}-${y}-${tick}`}
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