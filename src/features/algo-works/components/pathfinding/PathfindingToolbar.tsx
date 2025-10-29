import { useState, type ChangeEvent } from "react";
import { eventBus } from "../../../../utils/eventBus";
import { Play, Camera, CameraOff, Grid, CircleDot, Square, Eraser } from "lucide-react";

const ALGORITHMS = [{ value: "astar", label: "A* Search" }];

const BLOCKS = [
  { value: "wall", label: "Wall", icon: Square },
  { value: "start", label: "Start", icon: CircleDot },
  { value: "end", label: "End", icon: Grid },
  { value: "empty", label: "Eraser", icon: Eraser },
];

export const PathfindingToolbar = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    localStorage.getItem("path-algorithm") || ALGORITHMS[0].value
  );
  const [selectedBlock, setSelectedBlock] = useState(
    localStorage.getItem("block") || BLOCKS[0].value
  );
  const [cameraOn, setCameraOn] = useState(
    !!parseInt(localStorage.getItem("camera-update") || "0")
  );
  const [delay, setDelay] = useState(Number(localStorage.getItem("delay")) || 50);

  const handleAlgorithmChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const algo = e.target.value;
    setSelectedAlgorithm(algo);
    localStorage.setItem("path-algorithm", algo);
  };

  const handleBlockChange = (value: string) => {
    setSelectedBlock(value);
    localStorage.setItem("block", value);
  };

  const toggleCamera = () => {
    localStorage.setItem("camera-update", cameraOn ? "0" : "1");
    setCameraOn(!cameraOn);
  };

  const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDelay = Number(e.target.value);
    setDelay(newDelay);
    localStorage.setItem("delay", newDelay.toString());
  };

  return (
    <div
      className="
        flex flex-wrap items-center justify-end gap-4
        rounded-lg px-3 py-2
        bg-white/60 dark:bg-gray-900/50
        border border-gray-300/40 dark:border-gray-700/40
        backdrop-blur-md shadow-sm
      "
    >
      {/* Algorithm Selector */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="algorithm-select"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Algorithm:
        </label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
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

      {/* Draw Mode */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Draw:
        </span>
        <div className="flex gap-1">
          {BLOCKS.map((block) => {
            const Icon = block.icon;
            const active = selectedBlock === block.value;
            return (
              <button
                key={block.value}
                onClick={() => handleBlockChange(block.value)}
                className={`
                  p-2 rounded-md transition
                  ${
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow"
                      : "bg-gray-200/70 hover:bg-gray-300 dark:bg-gray-700/60 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  }
                `}
                title={block.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera Toggle */}
      <button
        onClick={toggleCamera}
        className={`
          flex items-center gap-1 p-2 rounded-md transition font-medium
          ${cameraOn
            ? "bg-green-500/90 hover:bg-green-600 text-white shadow-sm"
            : "bg-red-500/90 hover:bg-red-600 text-white shadow-sm"}
        `}
        title={cameraOn ? "Camera Updates On" : "Camera Updates Off"}
      >
        {cameraOn ? (
          <Camera className="w-4 h-4" />
        ) : (
          <CameraOff className="w-4 h-4" />
        )}
      </button>

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

      {/* Run Button */}
      <button
        onClick={() => eventBus.emit("run_algo")}
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

