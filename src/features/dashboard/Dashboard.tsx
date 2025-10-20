import { useState } from 'react';
import FeatureCard from './FeatureCard';
import './Dashboard.css';

interface DashboardProps {
  onSelectFeature: (feature: string, iconUrl: string) => void;
}

const features = [
  {
    id: 'algo-works',
    icon: 'https://cdn-icons-png.flaticon.com/512/5236/5236195.png',
    title: 'Algo Works',
    description: 'Visualisasikan cara kerja algoritma secara interaktif.',
    color: '#007bff',
    delay: '0s' // ++ Tambahkan delay
  },
  {
    id: 'calc-forge',
    icon: 'https://cdn-icons-png.flaticon.com/512/3713/3713488.png',
    title: 'Calc Forge',
    description: 'Hitung rumus ilmiah dengan cepat dan akurat.',
    color: '#28a745',
    delay: '0.5s' // ++ Tambahkan delay
  },
  {
    id: 'ar-lab',
    icon: 'https://cdn-icons-png.flaticon.com/512/3593/3593527.png',
    title: 'AR Lab',
    description: 'Ukur objek di dunia nyata menggunakan kamera Anda.',
    color: '#ffc107',
    delay: '1s' // ++ Tambahkan delay
  },
]
// ++ TAMBAHKAN DAFTAR ANIMASI INI ++
const entryAnimations = [
  'slide-in-from-bottom-left',
  'slide-in-from-top',
  'slide-in-from-right',
];
const shuffledAnimations = [...entryAnimations].sort(() => Math.random() - 0.5);
const generatePositions = () => [
  { top: '30%', left: '20%' },
  { top: '55%', left: '40%' },
  { top: '30%', left: '60%' },
].sort(() => Math.random() - 0.5); // Acak array posisi

export default function Dashboard({ onSelectFeature }: DashboardProps) {
  const [positions] = useState(generatePositions());

  return (
    <div className="dashboard-container">
      {/* Navigasi */}
      <header className="main-header">
        <div className="main-title">Smart Lab</div>
        <div className="header-right">Catatan Pencari</div>
        <div className="header-left">Sering</div>
      </header>

      {/* Menu */}
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          color={feature.color}
          onClick={() => onSelectFeature(feature.id , feature.icon)}
          style={{
            ...positions[index],
            animationDelay: `${feature.delay}, 1s`, // Delay untuk animasi masuk & melayang
            animationName: `${shuffledAnimations[index]}, zero-gravity`, // Terapkan nama animasi
          }}
        />
      ))}
    </div>
  );
}
