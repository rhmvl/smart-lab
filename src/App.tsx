import { useState } from 'react';
import Dashboard from './features/dashboard/Dashboard';
import Calculator from './features/calculator/Calculator';
import ArMeasure from './features/ar-measure/ArMeasure';
import Visualizer from './features/visualizer/Visualizer';
import Notes from './features/notes/Notes';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionIcon, setTransitionIcon] = useState('');
  const [isNotesOpen, setIsNotesOpen] = useState(false); // State baru untuk panel catatan

  const handleFeatureSelect = (feature: string, iconUrl: string) => {
    setTransitionIcon(iconUrl);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(feature);
      setIsTransitioning(false);
    }, 800);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'visualizer':
        return <Visualizer />;
      case 'calculator':
        return <Calculator />;
      case 'ar-measure':
        return <ArMeasure />;
      default:
        // Berikan fungsi yang benar ke Dashboard
        return <Dashboard onSelectFeature={handleFeatureSelect} />;
    }
  };

  return (
    <div className="app-container">
      {renderView()}

      {/* Lapisan Animasi Transisi */}
      {isTransitioning && (
        <div className="transition-overlay">
          <img src={transitionIcon} alt="Transition Icon" className="transition-icon" />
        </div>
      )}

      {/* === KONTROL UI TERPUSAT === */}
      <div className="global-ui-layer">
        {/* Tombol Kembali (hanya muncul jika bukan di dashboard) */}
        {currentView !== 'dashboard' && (
          <button onClick={handleBackToDashboard} className="app-button back-btn">
            Kembali
          </button>
        )}

        {/* Tombol Catatan (selalu muncul) */}
        <button onClick={() => setIsNotesOpen(true)} className="app-button notes-btn">
          Catatan
        </button>
      </div>

      {/* Panel Catatan (dikontrol oleh App.tsx) */}
      <Notes isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </div>
  );
}
//
//export default App;
//import { useState } from 'react';
//import Dashboard from './features/dashboard/Dashboard';
//import Calculator from './features/calculator/Calculator';
//import ArMeasure from './features/ar-measure/ArMeasure';
//import Visualizer from './features/visualizer/Visualizer';
//import Notes from './features/notes/Notes';
//import './App.css'; // Pastikan ada file ini untuk styling transisi
//
//function App() {
//  const [currentView, setCurrentView] = useState('dashboard');
//  const [isTransitioning, setIsTransitioning] = useState(false);
//  const [transitionIcon, setTransitionIcon] = useState('');
//  const handleFeatureSelect = (feature: string, iconUrl: string) => {
//    setTransitionIcon(iconUrl);
//    setIsTransitioning(true);
//    setTimeout(() => {
//      setCurrentView(feature);
//      setIsTransitioning(false);
//    }, 800);
//  };
//
//  const handleBackToDashboard = () => {
//    setCurrentView('dashboard');
//  };
//
//  const renderView = () => {
//    switch (currentView) {
//      case 'visualizer':
//        return <Visualizer />;
//      case 'calculator':
//        return <Calculator />;
//      case 'ar-measure':
//        return <ArMeasure />;
//      // case 'notes':
//      //   return <Notes />;
//      default:
//        return <Dashboard onSelectFeature={handleFeatureSelect} />;
//    }
//  };
//
//  return (
//    <div className="app-container">
//      {/* Tombol kembali ke dashboard (opsional) */}
//      {currentView !== 'dashboard' && (
//        <button
//          onClick={() => setCurrentView('dashboard')}
//          style={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}
//        >
//          Kembali
//        </button>
//      )}
//      {renderView()}
//      
//      {/* LAPISAN ANIMASI TRANSISI */}
//      {isTransitioning && (
//        <div className="transition-overlay">
//          <img src={transitionIcon} alt="Transition Icon" className="transition-icon" />
//        </div>
//      )}
//      
//      {/* Tombol kembali ke dashboard */}
//      {currentView !== 'dashboard' && (
//        <button onClick={handleBackToDashboard} className="back-button">
//          Kembali
//        </button>
//      )}
//      {renderView()}
//
//      {/* ... your transition overlay and back button ... */}
//
//      {/* Add the Notes component here */}
//      <Notes />
//    </div>
//  );
//}
//
export default App;