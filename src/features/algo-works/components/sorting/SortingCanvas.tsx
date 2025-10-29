import { memo, useEffect, useRef, useState } from "react";
import { eventBus } from "../../../../utils/eventBus";
import { Bar } from "../../../../types/bar";
import { COLORS, hexToCss } from "../../../../utils/colors";
import { runSortingAlgorithm } from "../../algorithms/runAlgorithm";

function createData(size: number) {
  return Array.from({ length: size }, (_, i) => new Bar(i, Math.random()));
}

export const SortingCanvas = memo(() => {
  const isActive = location.pathname.includes("/smart-lab/algo-works/sorting");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<Bar[]>(createData(Number(localStorage.getItem("array-size")) || 50));

  const [size, setSize] = useState({ width: 1, height: window.innerHeight - 140 }); // HARD CODED :v
  const isSortingRef = useRef(false);

  const delay = () => Number(localStorage.getItem("sort-delay")) || 50;
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
      const normalized = Math.pow((bar.value - minValue) / (maxValue - minValue || 1), 0.7);
      const barHeight = minBarHeight + normalized * (height - minBarHeight - topMargin);

      let color = COLORS.primary;
      if (done) color = COLORS.sorted;
      else if (swap.includes(i)) color = COLORS.swap;
      else if (active.includes(i)) color = COLORS.compare;

      ctx.fillStyle = hexToCss(color);
      ctx.shadowBlur = 6;

      const gap = Math.max(0.5, barWidth * 0.1);
      const effectiveWidth = barWidth - gap;

      ctx.fillRect(i * barWidth + gap / 2, height - barHeight, effectiveWidth, barHeight);
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
    if (!isSortingRef.current) return;
    const bars = barsRef.current;
    [bars[i], bars[j]] = [bars[j], bars[i]];
    render([], [i, j]);
    await new Promise((r) => setTimeout(r, delay()));
  };

  // === HANDLE RESIZING ===
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (size.width > 0 && size.height > 0) {
      render();
    }
  }, [size]);

  useEffect(() => {
    const handleGenerateArray = () => {
      isSortingRef.current = false; // cancel any ongoing sort
      const newSize = Number(localStorage.getItem("array-size")) || 50;
      barsRef.current = createData(newSize);
      render();
    };
    eventBus.on("generate_array", handleGenerateArray);
    return () => {
      isSortingRef.current = false;
      eventBus.off("generate_array", handleGenerateArray);
    };
  }, []);

  useEffect(() => {
    const handleSort = async () => {
      if (isSortingRef.current) return; // prevent overlapping sorts
      isSortingRef.current = true;

      const bars = barsRef.current;
      await runSortingAlgorithm(algorithm, bars, swapBars, render, delay, isSortingRef);

      render([], [], true);
      isSortingRef.current = false;
    };

    eventBus.on("run_sort", handleSort);
    return () => eventBus.off("run_sort", handleSort);
  }, [algorithm, delay]);

  useEffect(() => {
    const handleStop = () => {
      isSortingRef.current = false;
    };
    eventBus.on("stop_sort", handleStop);
    return () => eventBus.off("stop_sort", handleStop);
  }, []);

  useEffect(() => {
    render();
  }, []);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{
          background: COLORS.background,
          transition: "background 0.3s ease",
          display: "block",
        }}
      />
    </div>
  );
});

