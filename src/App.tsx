import { useState, useCallback, useRef } from 'react';
import Dashboard from './features/dashboard/Dashboard';
import CalcForge from './features/calc-forge/CalcForge';
import ArLab from './features/ar-lab/ArLab';
import AlgoWorks from './features/algo-works/AlgoWorks';
import Notes from './features/notes/Notes';
import Navbar from './components/layout/Navbar';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FeatureView } from './components/layout/FeatureView';
import { TransitionOverlay } from './components/layout/TransitionOverlay';
import { WEBSITE_URL } from './utils/config';
import { FlaskConicalIcon, type LucideIcon } from 'lucide-react';

// Main Router-enabled App Component
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Panggil hook
  // Tentukan apakah navbar visible (logika sama seperti di Navbar.tsx)
  const isNavbarVisible = location.pathname !== WEBSITE_URL;
  const [isNotesOpen, setNotesOpen] = useState(false);
  const [isTransitioning, setTransitioning] = useState(false);
  const [transitionIcon, setTransitionIcon] = useState<LucideIcon>(FlaskConicalIcon);
  const iconColor = useRef("white");

  const handleFeatureSelect = useCallback((featurePath: string, icon: LucideIcon, color: string) => {
    setTransitionIcon(icon);
    iconColor.current = color;
    setTransitioning(true);
    
    // Delay navigation to show the transition animation
    setTimeout(() => {
      navigate(WEBSITE_URL + '/' + featurePath);
      setTransitioning(false);
    }, 900);
  }, [navigate]);

  // const handleBackToDashboard = () => {
  //   if (!isTransitioning) {
  //   setTransitionIcon(FlaskConicalIcon); // Use a default icon for reverse transition
  //   setTransitioning(true);
  //   setTimeout(() => {
  //     navigate('/smart-lab');
  //     setTransitioning(false);
  //   }, 700);
  // }};

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className={isNavbarVisible ? "pt-16" : ""}>
        <Navbar setNotesOpen={setNotesOpen} />
        <Routes>
          {/* Berikan handleFeatureSelect DAN setNotesOpen ke Dashboard */}
          <Route path={WEBSITE_URL} element={<Dashboard onSelectFeature={handleFeatureSelect} setNotesOpen={setNotesOpen} />} />
          <Route path={`${WEBSITE_URL}/algo-works`} element={<AlgoWorks />} />
          <Route path={`${WEBSITE_URL}/calc-forge`} element={<CalcForge />} />
          <Route path={`${WEBSITE_URL}/ar-lab`} element={<ArLab />} />
          {/* HAPUS Route duplikat untuk Dashboard di bawah ini */}
          {/* <Route path={WEBSITE_URL} element={<Dashboard onSelectFeature={handleFeatureSelect} setNotesOpen={setNotesOpen} />} /> */}
          <Route path="*" element={<FeatureView title="404" description="Halaman tidak ditemukan." bgColor="bg-red-700" />} />
        </Routes>
      </div>
      {/* Panel Catatan (Modal) */}
      <Notes isOpen={isNotesOpen} onClose={() => setNotesOpen(false)} />

      {/* Lapisan Animasi Transisi */}
      <TransitionOverlay isTransitioning={isTransitioning} icon={transitionIcon} color={iconColor.current} />
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
