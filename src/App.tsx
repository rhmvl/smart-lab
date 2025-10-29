import { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './features/dashboard/Dashboard';
import CalcForge from './features/calc-forge/CalcForge';
import ArLab from './features/ar-lab/ArLab';
import AlgoWorks from './features/algo-works/AlgoWorks';
import Notes from './features/notes/Notes';
import Navbar from './components/layout/Navbar';
import SettingsPanel from "./components/common/SettingsPanel";
import { FeatureView } from './components/layout/FeatureView';
import { TransitionOverlay } from './components/layout/TransitionOverlay';
import { WEBSITE_URL } from './utils/config';
import { FlaskConicalIcon, type LucideIcon } from 'lucide-react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTheme } from './utils/useTheme';
// import { AudioProvider } from './context/AudioContext';

const AppContent = () => {
  useTheme();
  const navigate = useNavigate();

  const [isNotesOpen, setNotesOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isTransitioning, setTransitioning] = useState(false);
  const [transitionIcon, setTransitionIcon] = useState<LucideIcon>(FlaskConicalIcon);
  const [init, setInit] = useState(false);
  const iconColor = useRef('white');

  const changeFeature = useCallback(
    (featurePath: string, icon: LucideIcon, color: string) => {
      setTransitionIcon(icon);
      iconColor.current = color;
      setTransitioning(true);

      setTimeout(() => {
        navigate(WEBSITE_URL + '/' + featurePath);
        setTransitioning(false);
      }, 900);
    },
    [navigate]
  );

  useEffect(() => {
    initParticlesEngine(async (engine: any) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 2, random: true },
      links: { enable: false },
      move: {
        enable: true,
        speed: 1,
        direction: "bottom",
        random: false,
        straight: false,
        outModes: "out",
      },
    },
    interactivity: { events: {}, modes: {} },
    detectRetina: true,
  };

  const particlesLoaded = useCallback((container: any) => {
    console.log('Particles loaded:', container);
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      const splashScreen = document.getElementById('splash-screen');
      const textInterval = (window as any).splashTextInterval;
      const countdownInterval = (window as any).splashCountdownInterval;

      if (splashScreen) splashScreen.classList.add('hidden');
      if (textInterval) clearInterval(textInterval);
      if (countdownInterval) clearInterval(countdownInterval);

      setTimeout(() => splashScreen?.remove(), 500);
    }, 5000);

    return () => clearTimeout(splashTimer);
  }, []);

  const toggleNotes = useCallback(() => {
    setNotesOpen(!isNotesOpen);
  }, [isNotesOpen]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Efek Partikel Hujan */}
      {init && (
        <Particles
          id="tsparticles"
          // @ts-expect-error There is no error here
          options={particlesOptions}
          // @ts-expect-error There is no error here
          particlesLoaded={particlesLoaded}
          className="absolute inset-0 z-0"
        />
      )}
      <Navbar toggleNotesOpen={toggleNotes} changeFeature={changeFeature} setSettingsOpen={setSettingsOpen} />
      <Routes>
        <Route
          path={WEBSITE_URL}
          element={<Dashboard onSelectFeature={changeFeature} setNotesOpen={setNotesOpen} setSettingsOpen={setSettingsOpen} />}
        />
        <Route path={`${WEBSITE_URL}/algo-works/*`} element={<AlgoWorks />} />
        <Route path={`${WEBSITE_URL}/calc-forge`} element={<CalcForge />} />
        <Route path={`${WEBSITE_URL}/ar-lab/*`} element={<ArLab />} />
        <Route
          path="*"
          element={<FeatureView title="404" description="Halaman tidak ditemukan." bgColor="bg-red-700" />}
        />
      </Routes>

      {/* Panel Catatan (Modal) */}
      <Notes isOpen={isNotesOpen} onClose={() => setNotesOpen(false)} />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Lapisan Animasi Transisi */}
      <TransitionOverlay isTransitioning={isTransitioning} icon={transitionIcon} color={iconColor.current} />
    </div>
  );
};

// === APP WRAPPER ===
const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;

