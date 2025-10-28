import { memo, useEffect, useRef, useState } from "react";
import { eventBus } from "../../../../utils/eventBus";
import { Bar } from "../../../../types/bar";
import { COLORS } from "../../../../utils/colors";

import { bubbleSort } from "../../algorithms/sorting/bubble";
// import { selectionSort } from "../../algorithms/sorting/selection";
// import { insertionSort } from "../../algorithms/sorting/insertion";
// import { mergeSort } from "../../algorithms/sorting/merge";
// import { quickSort } from "../../algorithms/sorting/quick";
// import { heapSort } from "../../algorithms/sorting/heap";
// import { shellSort } from "../../algorithms/sorting/shell";

function createData(size: number) {
  return Array.from({ length: size }, (_, i) => new Bar(i, Math.random()));
}

const runSortingAlgorithm = async (
  algorithm: string,
  bars: Bar[],
  swapBars: (i: number, j: number) => Promise<void>,
  render: (active?: number[], swap?: number[], done?: boolean) => void,
  delay: number
) => {
  switch (algorithm) {
    case "bubble":
      await bubbleSort(bars, swapBars, render, delay);
      break;
    // case "selection":
    //   await selectionSort(bars, swapBars, render, delay);
    //   break;
    // case "insertion":
    //   await insertionSort(bars, swapBars, render, delay);
    //   break;
    // case "merge":
    //   await mergeSort(bars, swapBars, render, delay);
    //   break;
    // case "quick":
    //   await quickSort(bars, swapBars, render, delay);
    //   break;
    // case "heap":
    //   await heapSort(bars, swapBars, render, delay);
    //   break;
    // case "shell":
    //   await shellSort(bars, swapBars, render, delay);
    //   break;
    default:
      console.warn("Unknown sorting algorithm:", algorithm);
      break;
  }
};

export const SortingCanvas = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<Bar[]>(createData(Number(localStorage.getItem("array-size")) || 50));
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const delay = Number(localStorage.getItem("sort-delay")) || 50;
  const algorithm = localStorage.getItem("sort-algorithm") || "bubble";

  const drawBars = (
    ctx: CanvasRenderingContext2D,
    bars: Bar[],
    active: number[] = [],
    swap: number[] = [],
    done = false
  ) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    const barWidth = width / bars.length;
    const minBarHeight = 50;
    const topMargin = 50; 

    const values = bars.map((b) => b.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    bars.forEach((bar, i) => {
      const normalized = (bar.value - minValue) / (maxValue - minValue || 1); // avoid division by 0
      const barHeight = minBarHeight + normalized * (height - minBarHeight - topMargin);

      let color = COLORS.primary;
      if (done) color = COLORS.sorted;
      else if (swap.includes(i)) color = COLORS.swap;
      else if (active.includes(i)) color = COLORS.compare;

      ctx.fillStyle = color;
      ctx.shadowColor = COLORS.shadow;
      ctx.shadowBlur = 6;

      ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    });
  };

  const render = (active: number[] = [], swap: number[] = [], done = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawBars(ctx, barsRef.current, active, swap, done);
  };

  const swapBars = async (i: number, j: number) => {
    const bars = barsRef.current;
    [bars[i], bars[j]] = [bars[j], bars[i]];
    render([], [i, j]);
    await new Promise((r) => setTimeout(r, delay));
  };

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      render();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleGenerateArray = () => {
      const newSize = Number(localStorage.getItem("array-size")) || 50;
      barsRef.current = createData(newSize);
      render();
    };
    eventBus.on("generate_array", handleGenerateArray);
    return () => eventBus.off("generate_array", handleGenerateArray);
  }, []);

  // Sorting logic
  useEffect(() => {
    const handleSort = async () => {
      const bars = barsRef.current;
      runSortingAlgorithm(algorithm, bars, swapBars, render, delay)
    };

    eventBus.on("run_sort", handleSort);
    return () => eventBus.off("run_sort", handleSort);
  }, [algorithm, delay]);

  useEffect(() => {
    render();
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size.width}
      height={size.height}
      style={{
        width: "100vw",
        height: "100vh",
        background: COLORS.background,
        transition: "background 0.3s ease",
        display: "block",
      }}
    />
  );
});

