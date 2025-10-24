import { useCallback, useEffect, useRef, useState } from "react";
import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { Application, extend, useTick } from "@pixi/react";
import { Cell, type CellState } from "../../../types/cell.ts";
import { COLORS } from "../../../utils/colors.ts";
import { CELL_SIZE, COLS, ROWS } from "../../../utils/config.ts";
import { eventBus } from "../../../utils/eventBus.ts";
import { aStar } from "../algorithms/pathfinding/astar.ts";

extend({Container, Graphics});

const createGrid = (): Cell[][] =>
  Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => new Cell(x, y, 'empty'))
  );

// TODO: Fix some camera cordinate bug.
export const CanvasLayer = ({ viewportWidth, viewportHeight }: { viewportWidth: number, viewportHeight: number }) => {
  const [grid] = useState<Cell[][]>(createGrid);
  const [cameraUpdate, setCameraUpdate] = useState(true);
  
  // FOR CAMERA
  const lastPos = useRef({x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 }); 
  const startCameraPos = useRef({ x: 0, y: 0 });
  const DRAG_THRESHOLD = 5;
  // const grid = useMemo(() => createGrid(), []);
  const containerRef = useRef<Container>(null);
  const posRef = useRef({ x: 0, y: 0 });

  const mouseDown = useRef(false);
  const mouseType = useRef(false); // false: left, true: right;

  const startCell = useRef<Cell | null>(null);
  const endCell = useRef<Cell | null>(null);

  let running = false;

  // Calculate boundary constraints (Move these outside if they are constant)
  const CONTENT_WIDTH = COLS * CELL_SIZE;
  const CONTENT_HEIGHT = ROWS * CELL_SIZE;

  // Boundary check: Only clamp if content is larger than the viewport
  const minX = CONTENT_WIDTH > viewportWidth ? viewportWidth - CONTENT_WIDTH : 0;
  const maxX = CONTENT_WIDTH > viewportWidth ? 0 : 0;
  
  const minY = CONTENT_HEIGHT > viewportHeight ? viewportHeight - CONTENT_HEIGHT : 0;
  const maxY = CONTENT_HEIGHT > viewportHeight ? 0 : 0;

  const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
  };

  const updateVisual = useCallback(() => {
    // TODO: Maybe there is a better way for performace.
    grid.map((row) => {
      row.map((cell) => cell.updateState(cell.state))
    })
  }, [grid]);
  
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
      case "empty":
        // TODO;
        break;
    }

    cell.updateState(state);
    cell.drawPop(cell.color);
  }, [grid]);

  const drawCell = useCallback((x: number, y: number, color: number) => {
    if (grid[y][x].state === 'empty')
      grid[y][x].drawFade(color);
  }, [grid]);

  const handlePointer = useCallback((e: FederatedPointerEvent) => {
      if (!mouseDown.current || !containerRef.current) return;
      
      if (e.button === 2) mouseType.current = true;
      else if (e.button === 0) mouseType.current = false;

      const point = containerRef.current.toLocal(e.global);
      const x = Math.floor(point.x / CELL_SIZE);
      const y = Math.floor(point.y / CELL_SIZE);
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
      
      if (mouseType.current && e.pointerType === "mouse") {
        updateCell(x, y, 'empty');
        return;
      }
      
      const block = localStorage.getItem('block') as CellState;
      updateCell(x, y, block);
    },
    [updateCell]
  );

  const handleCamera = useCallback((e: FederatedPointerEvent) => {
    if (!mouseDown.current && !containerRef.current) 
      return;

    const currentX = e.global.x;
    const currentY = e.global.y;

    const dxTotal = currentX - dragStartPos.current.x;
    const dyTotal = currentY - dragStartPos.current.y;
    const distanceSq = dxTotal * dxTotal + dyTotal * dyTotal;
    
    if (distanceSq > DRAG_THRESHOLD * DRAG_THRESHOLD) {
      let newX = startCameraPos.current.x + dxTotal;
      let newY = startCameraPos.current.y + dyTotal;
      
      newX = clamp(newX, minX, maxX);
      newY = clamp(newY, minY, maxY);
      
      posRef.current = { x: newX, y: newY };
    }
    lastPos.current = { x: currentX, y: currentY };
  }, [minX, maxX, minY, maxY]);

  useEffect(() => {
    const handleUp = () => (mouseDown.current = false);
    const offRun = () => (running = !running);
    const camOn = () => setCameraUpdate(true);
    const camOff = () => setCameraUpdate(false);

    updateVisual(); // Update the grid visual on startup.

    eventBus.on("toggle_run", offRun);
    eventBus.on("camera_on", camOn);
    eventBus.on("camera_off", camOff);

    window.addEventListener("pointerup", handleUp);
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    return () => {
      window.removeEventListener("pointerup", handleUp);
      eventBus.off("toggle_run", offRun);
      eventBus.off("camera_on", camOn);
      eventBus.off("camera_off", camOff);
    }
  }, []);

  useEffect(() => {
    const handler = async () => {
      updateVisual();
      if (running || !startCell.current || !endCell.current) return alert("Start cell or end cell is not placed");
      running = true;
      await aStar(grid, startCell.current, endCell.current, drawCell);
      running = false;
    };

    eventBus.on("run_algo", handler);

    return () => {
      eventBus.off("run_algo", handler);
    }
  }, [grid, startCell, endCell, drawCell]);

  useTick(() => {
    if (containerRef.current && cameraUpdate && mouseDown.current) {
      containerRef.current.x = posRef.current.x;
      containerRef.current.y = posRef.current.y;
    }
  });
  
  return (
    <pixiContainer eventMode="static"
      ref={containerRef}
      onPointerDown={(e: FederatedPointerEvent) => {
      mouseDown.current = true;
      if (cameraUpdate && mouseDown.current) {
        startCameraPos.current = { x: posRef.current.x, y: posRef.current.y };
        dragStartPos.current = { x: e.global.x, y: e.global.y };
        lastPos.current = { x: e.global.x, y: e.global.y };
        handleCamera(e);
        return;
      }
      handlePointer(e);
    }}
    onPointerMove={(e: FederatedPointerEvent) => {
      if (cameraUpdate) {
        handleCamera(e);
        return;
      }
      handlePointer(e);
    }}

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
  const [size, setSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Application
      width={size.width}
      height={size.height}
      backgroundColor={COLORS.background}
    >
      <CanvasLayer viewportHeight={size.height} viewportWidth={size.width} />
    </Application>
  )
}
