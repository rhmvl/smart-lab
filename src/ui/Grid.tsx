import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { Application, extend, useApplication } from "@pixi/react";
import { Cell, type CellState } from "../types/cell.ts";
import { COLORS } from "../utils/colors";
import { CELL_SIZE, COLS, ROWS } from "../config";
import { eventBus } from "../utils/eventBus.ts";

extend({Container, Graphics});

const createGrid = (): Cell[][] =>
  Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => new Cell(x, y, 'empty'))
  );

export const CanvasLayer = () => {
  const { app } = useApplication(); // Do not delete this variable, even tough unused.
  const [grid, _] = useState<Cell[][]>(createGrid);
  const [tick, __] = useState(false);
  const mouseDown = useRef(false);

  const [startCell, setStartCell] = useState<{x: number, y: number} | null>(null);
  const [endCell, setEndCell] = useState<{x: number, y: number} | null>(null);

  const updateCell = useCallback((x: number, y: number) => {
    const block = localStorage.getItem('block') as CellState;

    if (block === 'start') {
      if (startCell !== null) grid[startCell.y][startCell.x].updateState('empty');
      setStartCell({x,y}); // TODO: LocalStorage
    }
    if (block === 'end') {
      if (endCell !== null) grid[endCell.y][endCell.x].updateState('empty');
      setEndCell({x,y}); // TODO: LocalStorage
    }
    grid[y][x].updateState(block);
  }, [grid, startCell, endCell, tick]); // ALSO THIS.

  const drawCell = useCallback((x: number, y: number, color: number) => {
    grid[y][x].draw(color);
  }, [grid, tick]);

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
    eventBus.on('run_algo', () => {
      console.log("Algorithm is runned");
    });
  }, []);

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
            key={`${x}-${y}-${tick}`}
            x={x * CELL_SIZE}
            y={y * CELL_SIZE}
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
