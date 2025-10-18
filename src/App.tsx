import React, { useState } from 'react';
import Dashboard from './features/dashboard/Dashboard';
import Calculator from './features/calculator/Calculator';
import ArMeasure from './features/ar-measure/ArMeasure';
import Visualizer from './features/visualizer/Visualizer';
// import Notes from './features/notes/Notes';

function App() {
  // State bisa berupa 'dashboard' atau nama fitur
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'visualizer':
        return <Visualizer />;
      case 'calculator':
        return <Calculator />;
      case 'ar-measure':
        return <ArMeasure />;
      // case 'notes':
      //   return <Notes />;
      default:
        return <Dashboard onSelectFeature={setCurrentView} />;
    }
  };

  return (
    <div className="app-container">
      {/* Tombol kembali ke dashboard (opsional) */}
      {currentView !== 'dashboard' && (
        <button
          onClick={() => setCurrentView('dashboard')}
          style={{ position: 'fixed', top: 20, left: 20, zIndex: 1000 }}
        >
          Kembali
        </button>
      )}
      {renderView()}
    </div>
  );
}

export default App;