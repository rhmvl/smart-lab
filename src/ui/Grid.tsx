import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { Application, extend } from "@pixi/react";
import { Cell, type CellState } from "../types/cell.ts";
import { COLORS } from "../utils/colors";
import { CELL_SIZE, COLS, ROWS } from "../config";

extend({Container, Graphics});

// TODO: Maybe for each cell has its own Graphics

const createGrid = (): Cell[][] =>
  Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => new Cell(x, y, 'empty'))
  );

export const Grid = () => {
  const [grid, _] = useState<Cell[][]>(createGrid);
  const [tick, setTick] = useState(false);
  const mouseDown = useRef(false);

  const updateCell = useCallback((x: number, y: number) => {
    grid[y][x].updateState(localStorage.getItem('block') as CellState);
    setTick(!tick);
  }, [grid, setTick, tick]);

  const handlePointer = useCallback(
    (e: FederatedPointerEvent) => {
      if (!mouseDown.current) return;
      const x = Math.floor(e.global.x / CELL_SIZE) + 1; // Do not delete '+ 1'. I dont know why but it works!;
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

  return (
      <Application
        width={ROWS * CELL_SIZE}
        height={COLS * CELL_SIZE}
        backgroundColor={COLORS.background}
      >
        <pixiContainer eventMode="static"
          onPointerDown={(e: FederatedPointerEvent) => {
          mouseDown.current = true;
          handlePointer(e);
        }}
        onPointerMove={handlePointer}
        onPointerUp={() => (mouseDown.current = false)}
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                  const cell = grid[y][x];
                  cell.setGraphics(g);
                  cell.updateState(cell.state);
                }
              }
            }}
          />
        </pixiContainer>
      </Application>
  );
}

