import { useRef, useEffect, useCallback, useState } from 'react';
import { Application, extend } from '@pixi/react';
import { Graphics, Container } from 'pixi.js';
import * as CONFIG from '../config';
import { COLORS } from '../utils/colors';
import { Cell } from '../types/cell';
import type { CellState } from '../types/cell';

extend({Container, Graphics})

const initializeGrid = (): Record<string, Cell> => {
  const cells: Record<string, Cell> = {};
  for (let r = 0; r < CONFIG.ROWS; r++) {
    for (let c = 0; c < CONFIG.COLS; c++) {
      const key = `${r}-${c}`;
      cells[key] = new Cell(r, c, 'empty');
    }
  }

  // TODO: Set a start and end with localStorage.
  cells['5-5'].setState('start');
  cells[`${CONFIG.ROWS - 6}-${CONFIG.COLS - 6}`].setState('end');
  return cells;
};

export const CanvasLayer = () => {
  const [gridCells] = useState(initializeGrid);
  const graphicsRef = useRef<Graphics | null>(null);
  const isDrawingRef = useRef(false);

  const updateCellVisual = useCallback((row: number, col: number, newState: CellState) => {
    const g = graphicsRef.current;
    const key = `${row}-${col}`;
    const cell = gridCells[key];

    if (!g || !cell) return;

    cell.update(newState);
  }, [gridCells]);

  useEffect(() => {
    const g = graphicsRef.current;
    if (!g) return;

    g.clear();
    Object.values(gridCells).forEach((cell: Cell) => {
      cell.graphics = g;
      cell.draw(cell.getColor());
    });
      
  }, [gridCells]);

  const getCellCoords = (x: number, y: number) => ({
    col: Math.floor(x / CONFIG.CELL_SIZE),
    row: Math.floor(y / CONFIG.CELL_SIZE),
  });

  const handleMouseAction = useCallback((e: MouseEvent) => {
    const { row, col } = getCellCoords(e.screenX, e.screenY);
    if (row < 0 || row >= CONFIG.ROWS || col < 0 || col >= CONFIG.COLS) return;

    const blockType: CellState = localStorage.getItem("block") as CellState || 'wall'; 
    
    updateCellVisual(row, col, blockType);
  }, [updateCellVisual]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDrawingRef.current) return;
    handleMouseAction(e);
  }, [handleMouseAction]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDrawingRef.current = true;
    handleMouseAction(e);
  }, [handleMouseAction]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    isDrawingRef.current = false;
    handleMouseAction(e);
  }, [handleMouseAction]);

  return (
    <pixiContainer
      eventMode='static'
      width={CONFIG.COLS * CONFIG.CELL_SIZE}
      height={CONFIG.ROWS * CONFIG.CELL_SIZE}
      onMouseUp={handleMouseUp}
      onPointerTap={handleMouseAction}
      onMouseUpOutside={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <pixiGraphics ref={graphicsRef} draw={() => {}}/>
    </pixiContainer>
  );
};

export const Grid = () => {
  return (
    <Application
      width={CONFIG.COLS * CONFIG.CELL_SIZE}
      height={CONFIG.ROWS * CONFIG.CELL_SIZE}
      backgroundColor={COLORS.background}
      antialias>
      <CanvasLayer />
    </Application>
  )
}
