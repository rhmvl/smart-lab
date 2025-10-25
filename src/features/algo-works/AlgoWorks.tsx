import { Routes, Route, useNavigate } from "react-router-dom";
import { PathfindingVisualizer } from "./visualizers/PathfindingVisualizer";
// import { SortingVisualizer } from "./visualizers/SortingVisualizer";
import { ArrowLeft, Network } from "lucide-react";
import { Toolbar } from "./components/Toolbar";

const algorithmOptions = [
  {
    key: "pathfinding",
    title: "Pathfinding Visualizer",
    description: "Eksplorasi algoritma pencarian jalur (Dijkstra, A*, BFS).",
    color: "from-blue-500 to-blue-700",
    icon: Network,
    component: PathfindingVisualizer,
  },
  // {
  //   key: "sorting",
  //   title: "Sorting Visualizer",
  //   description: "Lihat bagaimana algoritma pengurutan bekerja.",
  //   color: "from-green-500 to-emerald-700",
  //   icon: BarChart,
  //   component: SortingVisualizer,
  // },
];

export default function AlgoWorks() {
  return (
    <Routes>
      <Route path="/" element={<AlgoMenu />} />
      {algorithmOptions.map((algo) => (
        <Route
          key={algo.key}
          path={algo.key}
          element={<VisualizerPage algo={algo} />}
        />
      ))}
    </Routes>
  );
}


function AlgoMenu() {
  const navigate = useNavigate();
  
  // TODO: Maybe add backdrop blur to with animated-background style.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-0 overflow-hidden">
      {/* Background overlay for readability */}

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg">
          Algo Works
        </h1>
        <p className="text-white/90 mb-12 text-center max-w-lg">
          Pilih jenis visualisasi algoritma yang ingin kamu jelajahi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {algorithmOptions.map((algo) => {
            const Icon = algo.icon;
            return (
              <button
                key={algo.key}
                onClick={() => navigate(algo.key)}
                className={`
                  group relative overflow-hidden rounded-2xl shadow-xl border border-white/20
                  bg-gradient-to-br ${algo.color} text-white p-6 transition transform hover:scale-[1.05]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-6 h-6 text-white/90" />
                  <div className="text-xl font-bold group-hover:translate-y-[-2px] transition-transform">
                    {algo.title}
                  </div>
                </div>
                <p className="text-sm text-white/90 group-hover:text-white transition-colors">
                  {algo.description}
                </p>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white"></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VisualizerPage({ algo }: { algo: typeof algorithmOptions[number] }) {
  const navigate = useNavigate();
  const Component = algo.component;

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toolbar Row */}
      <div
        className="
          flex items-center justify-between flex-wrap gap-3
          bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-3 shadow-sm
        "
      >
        {/* Left: Back Button */}
        <button
          onClick={() => navigate("/smart-lab/algo-works")}
          className="
            inline-flex items-center gap-2 px-3 py-2 rounded-md
            bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600
            text-gray-800 dark:text-gray-100 font-medium transition
          "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Right: Algorithm-Specific Toolbar */}
        <div className="flex-1 flex bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
        rounded-lg shadow-sm
">
          <Toolbar />
        </div>
      </div>

      {/* Visualizer Display */}
        <Component />
    </div>
  );
}


