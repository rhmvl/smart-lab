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
        <h1>Smmart Lab</h1>
      </div>
      <div className="navbar-menu">
        <MenuItem
          title="Algo Works"
          isActive={activeFeature === 'algo-works'}
          onClick={() => onSelectFeature('algo-works')}
        />
        <MenuItem
          title="Calc Forge"
          isActive={activeFeature === 'calc-forge'}
          onClick={() => onSelectFeature('calc-forge')}
        />
        <MenuItem
          title="Ar Lab"
          isActive={activeFeature === 'ar-lab'}
          onClick={() => onSelectFeature('ar-lab')}
        />
        <MenuItem
          title="Notes"
          isActive={activeFeature === 'notes'}
          onClick={() => onSelectFeature('notes')}
        />
      </div>
    </nav>
  );
}
