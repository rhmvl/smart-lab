import { useState, useEffect } from "react";
import { Play, Square, SlidersHorizontal, X, Shuffle } from "lucide-react";

export const SortingTutorialPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seenTutorial = localStorage.getItem("sorting-tutorial-seen");
    if (!seenTutorial) {
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  const closeTutorial = () => {
    localStorage.setItem("sorting-tutorial-seen", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-300
      "
    >
      <div
        className="
          relative max-w-md w-[90%] rounded-xl p-6
          bg-white/80 dark:bg-gray-900/80
          border border-gray-300/50 dark:border-gray-700/50
          shadow-xl backdrop-blur-md
          text-center text-gray-800 dark:text-gray-100
          animate-animate-fadeIn
        "
      >
        {/* Close Button */}
        <button
          onClick={closeTutorial}
          className="
            absolute top-3 right-3 p-1 rounded-full
            hover:bg-gray-200/70 dark:hover:bg-gray-800/70
            transition
          "
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-bold mb-3">
          Welcome to Sorting Visualizer
        </h2>

        <p className="text-sm mb-3 leading-relaxed">
          Here’s a quick guide to get you started:
        </p>

        {/* Tutorial Steps */}
        <ul className="text-left text-sm space-y-1 mb-4">
          <div className="flex gap-3">
            <Shuffle className="w-4 h-4" />
            Generate: Click “Generate” to create a new random array.
          </div>
          <div className="flex gap-3">
            <SlidersHorizontal className="w-4 h-4" />
            Size / Speed: Adjust array size and visualization speed.
          </div>
          <div className="flex gap-3">
            <Play className="w-4 h-4" />
            Run: Choose a sorting algorithm and press “Run” to see it in action.
          </div>
          <div className="flex gap-3">
            <Square className="w-4 h-4" />
            Colors: Bars change color to show comparisons and swaps.
          </div>
        </ul>

        {/* Action Button */}
        <button
          onClick={closeTutorial}
          className="
            px-4 py-2 rounded-md font-semibold text-white
            bg-gradient-to-r from-indigo-500 to-pink-500
            hover:from-indigo-600 hover:to-pink-600
            transition active:scale-[0.97]
          "
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
