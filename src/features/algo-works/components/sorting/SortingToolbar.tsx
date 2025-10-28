import { useState, type ChangeEvent } from "react";
import { eventBus } from "../../../../utils/eventBus";
import { Play, RotateCcw } from "lucide-react";

const ALGORITHMS = [
  { value: "bubble", label: "Bubble Sort" },
  { value: "selection", label: "Selection Sort" },
  { value: "insertion", label: "Insertion Sort" },
  { value: "quick", label: "Quick Sort" },
  { value: "merge", label: "Merge Sort" },
];

export const SortingToolbar = () => {
  const [algorithm, setAlgorithm] = useState(
    localStorage.getItem("sort-algorithm") || ALGORITHMS[0].value
  );
  const [arraySize, setArraySize] = useState(
    Number(localStorage.getItem("array-size")) || 50
  );
  const [delay, setDelay] = useState(Number(localStorage.getItem("sort-delay")) || 50);

  const handleAlgorithmChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAlgorithm(value);
    localStorage.setItem("sort-algorithm", value);
  };

  const handleArraySizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setArraySize(value);
    localStorage.setItem("array-size", value.toString());
    eventBus.emit("generate_array");
  };

  const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setDelay(value);
    localStorage.setItem("sort-delay", value.toString());
  };

  const runSort = () => eventBus.emit("run_sort");
  const resetArray = () => eventBus.emit("generate_array");

  return (
    <div
      className="
        flex flex-wrap items-center justify-end gap-3
        rounded-lg border border-gray-300/40 dark:border-gray-700/40
        bg-white/60 dark:bg-gray-900/50 backdrop-blur-md
        px-3 py-2 shadow-sm
      "
    >
      {/* Algorithm Selector */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="sort-algo"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Algorithm:
        </label>
        <select
          id="sort-algo"
          value={algorithm}
          onChange={handleAlgorithmChange}
          className="
            rounded-md border border-gray-300 dark:border-gray-600 
            bg-white/80 dark:bg-gray-800/70 
            px-2 py-1 text-sm
            text-gray-800 dark:text-gray-100
            focus:ring-2 focus:ring-indigo-400 focus:outline-none
            transition
          "
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>
      </div>

      {/* Array Size Slider */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Size:
        </label>
        <input
          type="range"
          min="10"
          max="200"
          step="10"
          value={arraySize}
          onChange={handleArraySizeChange}
          className="w-24 cursor-pointer accent-indigo-500"
        />
        <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-center">
          {arraySize}
        </span>
      </div>

      {/* Delay Slider */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Delay:
        </label>
        <input
          type="range"
          min="0"
          max="200"
          step="10"
          value={delay}
          onChange={handleDelayChange}
          className="w-24 cursor-pointer accent-indigo-500"
        />
        <span className="text-xs text-gray-600 dark:text-gray-400 w-8 text-center">
          {delay}ms
        </span>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetArray}
        className="
          inline-flex items-center gap-2 px-3 py-2 rounded-md
          bg-gray-200/70 hover:bg-gray-300/80
          dark:bg-gray-700/70 dark:hover:bg-gray-600
          text-gray-800 dark:text-gray-100 font-medium transition shadow-sm
          active:scale-[0.97]
        "
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset</span>
      </button>

      {/* Run Button */}
      <button
        onClick={runSort}
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-md
          bg-gradient-to-r from-indigo-500 to-pink-500 
          hover:from-indigo-600 hover:to-pink-600
          text-white font-semibold transition shadow
          active:scale-[0.97]
        "
      >
        <Play className="w-4 h-4" />
        <span>Run</span>
      </button>
    </div>
  );
};

