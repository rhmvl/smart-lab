import { useEffect, useState, useMemo } from "react";
import { Settings, Notebook, type LucideIcon } from "lucide-react";
import FeatureCard from './FeatureCard';
import './Dashboard.css';
import { WEB_PAGE } from "../../utils/config";

interface DashboardProps {
  onSelectFeature: (feature: string, icon: LucideIcon, color: string) => void;
  setNotesOpen: (isOpen: boolean) => void;
  setSettingsOpen: (isOpen: boolean) => void
}

const animationVars = [
  "--animate-spin-card",
  "--animate-breathe",
  "--animate-zero-gravity",
  "--animate-side-to-side",
  "--animate-up-and-down",
  "--animate-pendulum",
  "animate-flicker", // Flicker sebagai loop
];

const randomAnimations = () =>
  [...animationVars].sort(() => Math.random() - 0.5).slice(0, 3);

const cardPositions = [
  { top: "20%", left: "16%" },
  { top: "40%", left: "44%" },
  { top: "20%", left: "70%" },
];

export default function Dashboard({ onSelectFeature, setNotesOpen, setSettingsOpen }: DashboardProps) {
  const [cardAnimations, setCardAnimations] = useState<string[]>([]);
  const initialRandomAnimations = useMemo(() => randomAnimations(), []);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;

    const updateTilt = () => {
      document.querySelectorAll<HTMLElement>(".feature-card-interactive").forEach((el) => {
        const xTilt = ((mouseY - window.innerHeight / 2) / 80).toFixed(2);
        const yTilt = ((mouseX - window.innerWidth / 2) / 80).toFixed(2);
        el.style.setProperty("--rotateX", `${-xTilt}deg`);
        el.style.setProperty("--rotateY", `${yTilt}deg`);
      });
      ticking = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!ticking) {
        requestAnimationFrame(updateTilt);
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const startLoopTimer = setTimeout(() => {
      setCardAnimations(initialRandomAnimations);
    }, 1000);

    const changeLoopInterval = setInterval(() => {
      setCardAnimations(randomAnimations());
    }, Math.random() * 2000 + 5000); // 5-7 detik

    return () => {
      clearTimeout(startLoopTimer);
      clearInterval(changeLoopInterval);
    };
  }, [initialRandomAnimations]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <header
        className="
          fixed top-4 left-1/2 z-30
          flex w-auto max-w-[95%] -translate-x-1/2 items-center justify-between
          rounded-xl border px-6 py-3 shadow-lg backdrop-blur-md
          bg-white/70 border-gray-200/30 text-gray-900
          dark:bg-gray-900/60 dark:border-gray-700/40 dark:text-white
          transition-all duration-300
        "
      >
        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight drop-shadow-sm select-none mr-6">
          Smart Lab
        </h1>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border text-gray-800 dark:text-gray-200
              border-gray-300/40 dark:border-gray-700/50
              bg-white/40 dark:bg-gray-800/40
              shadow-sm backdrop-blur-sm
              hover:scale-110 hover:rotate-6 hover:bg-white/60 hover:dark:bg-gray-700/60
              transition-all duration-200 active:scale-95
            "
          >
            <Settings size={18} />
          </button>

          <button
            onClick={() => setNotesOpen(true)}
            title="Notes"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border text-gray-800 dark:text-gray-200
              border-gray-300/40 dark:border-gray-700/50
              bg-white/40 dark:bg-gray-800/40
              shadow-sm backdrop-blur-sm
              hover:scale-110 hover:rotate-6 hover:bg-white/60 hover:dark:bg-gray-700/60
              transition-all duration-200 active:scale-95
            "
          >
            <Notebook size={18} />
          </button>
        </div>
      </header>

      {/* Feature Cards */}
      <div className="relative z-10 w-full">
        {WEB_PAGE.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            onClick={() => onSelectFeature(feature.id, feature.icon, feature.color)}
            style={{
              ...cardPositions[index],
              animation: `var(${cardAnimations[index % cardAnimations.length]})`,
              'animationDelay': `${feature.delay || "0s"}`,
              willChange: "transform, opacity",
              // '--rotateX': '0deg',
              // '--rotateY': '0deg'
            }}
          />
        ))}
      </div>
    </div>
  );
}

