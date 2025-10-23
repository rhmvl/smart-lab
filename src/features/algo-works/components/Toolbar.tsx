import { useState, type ChangeEvent } from 'react';
import { eventBus } from '../../../utils/eventBus';

const ALGORITHMS = [
  { value: 'astar', label: 'A* Search' },
];

const BLOCKS = [
  { value: 'wall', label: 'Wall (Obstacle)' },
  { value: 'start', label: 'Start Point' },
  { value: 'end', label: 'End Point' },
  { value: 'empty', label: 'Eraser' },
];

export const Toolbar = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[0].value);
  const [selectedBlock, setSelectedBlock] = useState(localStorage.getItem('block') || BLOCKS[0].value);

  const handleAlgorithmChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const algo = e.target.value;
    setSelectedAlgorithm(algo);
    localStorage.setItem("path-algorithm", algo);
  };

  const handleBlockChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const block = e.target.value;
    setSelectedBlock(block);
    localStorage.setItem("block", block);
  };

  return (
    <div>
      {/* 1. Algorithm Selector */}
      <div>
        <label htmlFor="algorithm-select">Algorithm:</label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
          onChange={handleAlgorithmChange}
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Block Selector */}
      {/* TODO: Untuk Block Selector mungkin jangan select, tapi tombol masing masing mungking dengan icon.*/}
      <div>
        <label htmlFor="block-select">Draw Mode:</label>
        <select
          id="block-select"
          value={selectedBlock}
          onChange={handleBlockChange}
        >
          {BLOCKS.map((block) => (
            <option key={block.value} value={block.value}>
              {block.label}
            </option>
          ))}
        </select>
      </div>

      {/* MAKE THIS TO BE A TOGGLE AND CHANGED IT TO ICON */}
      <button 
        onClick={() => eventBus.emit('camera_on')} 
      >
        Camera Update On
      </button>
      <button 
        onClick={() => eventBus.emit('camera_off')} 
      >
        Camera Update Off
      </button> 

      {/* Make a delay slider or something for localStorage.getItem('delay')*/}

      {/* 3. Run Button */}
      <button 
        onClick={() => eventBus.emit('run_algo')} 
      >
        Run
      </button>
    </div>
  );
};

