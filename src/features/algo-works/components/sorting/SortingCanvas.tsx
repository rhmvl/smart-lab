import { memo, useEffect, useRef, useState, useCallback } from "react";
import { Application, extend, useApplication, useTick } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { COLORS } from "../../../../utils/colors.ts";
import { eventBus } from "../../../../utils/eventBus.ts";
import { Bar } from "../../../../types/bar.ts";
// import { bubbleSort } from "../algorithms/bubbleSort.ts";

extend({ Container, Graphics });

function createData(size: number) {
  const arr = Array.from({ length: size }, () => Math.random());
  return arr.map((value, index) => new Bar(index, value));
}

const SortingCanvasLayer = ({ width, height }: { width: number; height: number }) => {
  useApplication();
  const containerRef = useRef<Container>(null);
  const dataRef = useRef<Bar[]>(createData(Number(localStorage.getItem("array-size")) || 50));
  const [refreshKey, setRefreshKey] = useState(0);

  const delay = Number(localStorage.getItem("sort-delay")) || 50;
  const algorithm = localStorage.getItem("sort-algorithm") || "bubble";

  const barWidth = width / dataRef.current.length;

  const swapBars = useCallback((i: number, j: number) => {
    const bars = dataRef.current;
    const temp = bars[i];
    bars[i] = bars[j];
    bars[j] = temp;

    bars[i].index = i;
    bars[j].index = j;

    bars[i].animateSwap(i);
    bars[j].animateSwap(j);
  }, []);

  useTick(() => {
    dataRef.current.forEach((bar) => bar.draw());
  });

  useEffect(() => {
    const handleGenerateArray = () => {
      const arraySize = Number(localStorage.getItem("array-size")) || 50;
      dataRef.current = createData(arraySize);
      setRefreshKey((k) => k + 1); // force re-render so pixiGraphics remount
    };

    eventBus.on("generate_array", handleGenerateArray);
    return () => eventBus.off("generate_array", handleGenerateArray);
  }, []);

  useEffect(() => {
    const handleSort = async () => {
      const bars = dataRef.current;
      switch (algorithm) {
        case "bubble":
          // await bubbleSort(bars, swapBars, delay);
          break;
        default:
          console.warn("Unknown algorithm:", algorithm);
      }
    };

    eventBus.on("run_sort", handleSort);
    return () => eventBus.off("run_sort", handleSort);
  }, [algorithm, swapBars, delay]);

  return (
    <pixiContainer ref={containerRef} key={refreshKey}>
      {dataRef.current.map((bar, index) => (
        <pixiGraphics
          key={index}
          x={index * barWidth}
          y={height - bar.height}
          draw={(g) => {
            bar.setGraphics(g);
            bar.width = barWidth;
            bar.height = bar.value * (height * 0.9);
            bar.draw();
          }}
        />
      ))}
    </pixiContainer>
  );
};

export const SortingCanvas = memo(() => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const isActive = location.pathname.includes("/smart-lab/algo-works/sorting");

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isActive) return null;

  return (
    <Application
      resizeTo={window}
      width={size.width}
      height={size.height}
      backgroundColor={COLORS.background}
    >
      <SortingCanvasLayer width={size.width} height={size.height} />
    </Application>
  );
});

