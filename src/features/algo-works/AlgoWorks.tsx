import { Routes, Route, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart, Network } from "lucide-react";
import { PathfindingToolbar } from "./components/PathfindingToolbar";
import { PathfindingVisualizer } from "./visualizers/PathfindingVisualizer";
import AlgoChallenge from './AlgoChallenge'; // <-- 1. Impor file baru

const algorithmOptions = [
  {
    key: "pathfinding",
    title: "Pathfinding Visualizer",
    description: "Eksplorasi algoritma pencarian jalur seperti Dijkstra dan A*.",
    color: "from-blue-500 to-indigo-600",
    icon: Network,
    component: PathfindingVisualizer,
    toolbar: PathfindingToolbar,
  },
  {
    key: "sorting",
    title: "Sorting Visualizer",
    description: "Lihat bagaimana algoritma pengurutan bekerja secara interaktif.",
    color: "from-emerald-500 to-green-700",
    icon: BarChart,
    component: () => <></>,
    toolbar: () => <></>,
  },
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

  return (
    <div className="
      relative flex min-h-screen flex-col items-center justify-center px-6 py-12
      text-gray-900 dark:text-white overflow-hidden
    ">
      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">Algo Works</h1>
        <p className="max-w-lg text-gray-600 dark:text-gray-300 mb-12">
          Pilih visualisasi algoritma yang ingin kamu jelajahi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl">
          {algorithmOptions.map(({ key, title, description, color, icon: Icon }) => (
            <button
              key={key}
              onClick={() => navigate(key)}
              className={`
                group relative overflow-hidden rounded-2xl p-6 shadow-lg
                bg-gradient-to-br ${color}
                text-white transition-transform hover:scale-[1.04] focus:outline-none
                focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 opacity-90" />
                <h3 className="text-lg font-bold group-hover:-translate-y-0.5 transition-transform">
                  {title}
                </h3>
              </div>
              <p className="text-sm text-white/90 group-hover:text-white transition-colors">
                {description}
              </p>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisualizerPage({ algo }: { algo: typeof algorithmOptions[number] }) {
  const navigate = useNavigate();
  const Component = algo.component;
  const Toolbar = algo.toolbar;

  return (
    <div className="relative min-h-screen flex flex-col gap-4 p-6
      bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100
      transition-colors duration-300
    ">
      {/* Toolbar */}
      <div className="
        flex flex-wrap items-center justify-between gap-3
        rounded-xl border border-gray-300/50 dark:border-gray-700/60
        bg-white/70 dark:bg-gray-800/60 backdrop-blur-md
        px-4 py-3 shadow-sm
      ">
        <button
          onClick={() => navigate("/smart-lab/algo-works")}
          className="
            flex items-center gap-2 px-3 py-2 rounded-md font-medium transition
            bg-gray-200 hover:bg-gray-300 text-gray-800
            dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100
          "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex-1 flex justify-end">
          <Toolbar />
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="
        flex-1 flex items-center justify-center rounded-xl border
        border-gray-200/60 dark:border-gray-700/50
        bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-inner
        transition-colors duration-300
      ">
        <Component />
      </div>
    </div>
  );
}

