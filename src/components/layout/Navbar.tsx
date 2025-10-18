import React from 'react';
import MenuItem from '../common/MenuItem'; // Kita akan buat ini
import './Navbar.css'; // Untuk styling navbar

interface NavbarProps {
  activeFeature: string;
  onSelectFeature: (feature: string) => void;
}

export default function Navbar({ activeFeature, onSelectFeature }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/vite.svg" alt="Logo" className="navbar-logo" /> {/* Anda bisa ganti logo nanti */}
        <h1>Field Project Assistant</h1>
      </div>
      <div className="navbar-menu">
        <MenuItem
          title="Visualizer"
          isActive={activeFeature === 'visualizer'}
          onClick={() => onSelectFeature('visualizer')}
        />
        <MenuItem
          title="Kalkulator"
          isActive={activeFeature === 'calculator'}
          onClick={() => onSelectFeature('calculator')}
        />
        <MenuItem
          title="Pengukur Jarak"
          isActive={activeFeature === 'ar-measure'}
          onClick={() => onSelectFeature('ar-measure')}
        />
        <MenuItem
          title="Catatan"
          isActive={activeFeature === 'notes'}
          onClick={() => onSelectFeature('notes')}
        />
      </div>
    </nav>
  );
}