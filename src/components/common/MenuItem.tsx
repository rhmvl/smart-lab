import './MenuItem.css'; // Untuk styling item menu

interface MenuItemProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

export default function MenuItem({ title, isActive, onClick }: MenuItemProps) {
  return (
    <button
      className={`menu-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {title}
      <span className="apromic-glass-effect"></span> {/* Efek gelas apromic */}
    </button>
  );
}
