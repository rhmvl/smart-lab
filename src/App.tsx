import { useState, useCallback } from 'react';
import Dashboard from './features/dashboard/Dashboard';
import CalcForge from './features/calc-forge/CalcForge';
import ArLab from './features/ar-lab/ArLab';
import AlgoWorks from './features/algo-works/AlgoWorks';
import Notes from './features/notes/Notes';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Notebook } from 'lucide-react';

interface TransitionOverlayProps {
  isTransitioning: boolean;
  transitionIcon: string;
}

interface FeatureIcon {
  url: string;
  name: string;
}

interface FeatureIcons {
  [key: string]: FeatureIcon;
}

interface FeatureViewProps {
  title: string;
  description: string;
  bgColor: string;
}

const FEATURE_ICONS: FeatureIcons = {
  'algo-works': { url: 'https://cdn-icons-png.flaticon.com/512/5236/5236195.png', name: 'AlgoWorks' },
  'calc-forge': { url: 'https://cdn-icons-png.flaticon.com/512/3713/3713488.png', name: 'CalcForge' },
  'ar-lab': { url: 'https://cdn-icons-png.flaticon.com/512/3593/3593527.png', name: 'AR+Lab' },
};
const WEBSITE_URL = "/smart-lab";

const FeatureView: React.FC<FeatureViewProps> = ({ title, description, bgColor }) => (
  <div className="flex items-center justify-center w-full h-full pt-20 p-8 text-center">
    <div className={`p-10 rounded-xl shadow-2xl text-white ${bgColor} max-w-md w-full`}>
      <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
      <p className="text-lg">{description}</p>
    </div>
  </div>
);

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ isTransitioning, transitionIcon }) => (
  <div 
    className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-700 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
    style={{ transitionProperty: 'opacity' }}
  >  
    <div className="absolute inset-0 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-float-react">
          <img 
            src={transitionIcon} 
            alt="Transition Icon" 
            className="w-[150px] h-[150px] rounded-full shadow-2xl" 
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = 'https://placehold.co/150x150/94a3b8/ffffff?text=Icon'; 
              }}
          />
        </div>
        <div className="w-[100px] h-5 bg-black/20 rounded-full blur-md mt-4 animate-float-shadow-react"></div>
      </div>
    </div>
  </div>
);

// Main Router-enabled App Component
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionIcon, setTransitionIcon] = useState('');

  const isDashboard = location.pathname === WEBSITE_URL;

  const handleFeatureSelect = useCallback((featurePath: string, iconUrl: string) => {
    setTransitionIcon(iconUrl);
    setIsTransitioning(true);
    
    // Delay navigation to show the transition animation
    setTimeout(() => {
      navigate(WEBSITE_URL + '/' + featurePath);
      setIsTransitioning(false);
    }, 900);
  }, [navigate]);

    const handleBackToDashboard = () => {
        if (!isTransitioning) {
        setTransitionIcon(FEATURE_ICONS['calc-forge'].url); // Use a default icon for reverse transition
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/smart-lab');
            setIsTransitioning(false);
        }, 700);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Main Dashboard/Feature Container - Background Gradient */}
        <Routes>
          <Route path={WEBSITE_URL} element={<Dashboard onSelectFeature={handleFeatureSelect} />} />
          <Route path={`${WEBSITE_URL}/algo-works`} element={<AlgoWorks />} />
          <Route path={`${WEBSITE_URL}/calc-forge`} element={<CalcForge />} />
          <Route path={`${WEBSITE_URL}/ar-lab`} element={<ArLab />} />
          {/* Add a 404/Catch-all route */}
          <Route path="*" element={<FeatureView title="404" description="Halaman tidak ditemukan." bgColor="bg-red-700" />} />
        </Routes>

      {/* Global UI Layer */}
      <div className="fixed top-0 left-0 right-0 p-5 md:px-10 flex justify-between items-center z-40">
        
        {/* Tombol Kembali (hanya muncul jika bukan di dashboard) */}
        { /*
        {!isDashboard && ( <>
          <button 
            onClick={handleBackToDashboard} 
            className="flex items-center space-x-2 text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-black/50 transition-colors"
            disabled={isTransitioning}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali</span>
          </button>

          <div className="w-0 md:w-20"></div>
        </>)}
        
        <button 
          onClick={() => setIsNotesOpen(true)} 
          className="flex items-center space-x-2 text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-full shadow-lg transition-colors"
        >
          <Notebook className="w-5 h-5" />
          <span className="font-semibold hidden sm:inline">Catatan</span>
        </button>
        */}
      </div>

      {/* Panel Catatan (Modal) */}
      <Notes isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />

      {/* Lapisan Animasi Transisi */}
      <TransitionOverlay isTransitioning={isTransitioning} transitionIcon={transitionIcon} />
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
