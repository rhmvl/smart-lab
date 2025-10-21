import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { Application, extend, useApplication } from "@pixi/react";
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
  // useApplication();
  const [grid] = useState<Cell[][]>(createGrid);
  const mouseDown = useRef(false);
  let running = false;

  // const [startCell, setStartCell] = useState<Cell | null>(null);
  // const [endCell, setEndCell] = useState<Cell | null>(null);
  const startCell = useRef<Cell | null>(null);
  const endCell = useRef<Cell | null>(null);

  const updateCell = useCallback((x: number, y: number) => {
    const cell = grid[y][x];
    const block = localStorage.getItem('block') as CellState;

    if (cell.state === block) return;
    switch (block) {
      case "start":
        if (startCell !== null) startCell.current?.updateState('empty');
        startCell.current = cell
        break;
      case "end":
        if (endCell !== null) endCell.current?.updateState('empty');
        endCell.current = cell;
        break;
    }

    cell.updateState(block);
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
    const offRun = () => (running = !running);

    updateVisual();

    eventBus.on("toggle_run", offRun);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mouseup", handleUp);
      eventBus.off("toggle_run", offRun);
    }
  }, []);

  useEffect(() => {
    const handler = async () => {
      updateVisual();
      if (running || !startCell || !endCell) return;
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
