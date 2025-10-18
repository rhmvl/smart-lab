import React, { useState, useEffect } from 'react';
import FeatureCard from './FeatureCard';
import './Dashboard.css';

interface DashboardProps {
  onSelectFeature: (feature: string) => void;
}

const features = [
  {
    id: 'visualizer',
    icon: 'https://cdn-icons-png.flaticon.com/512/5236/5236195.png',
    title: 'Algo-Explorer',
    description: 'Visualisasikan cara kerja algoritma secara interaktif.',
    color: '#007bff',
    delay: '0s' // ++ Tambahkan delay
  },
  {
    id: 'calculator',
    icon: 'https://cdn-icons-png.flaticon.com/512/3713/3713488.png',
    title: 'Kalkulator',
    description: 'Hitung rumus fisika & kimia dengan cepat dan akurat.',
    color: '#28a745',
    delay: '0.5s' // ++ Tambahkan delay
  },
  {
    id: 'ar-measure',
    icon: 'https://cdn-icons-png.flaticon.com/512/3593/3593527.png',
    title: 'Pengukur Jarak',
    description: 'Ukur objek di dunia nyata menggunakan kamera Anda.',
    color: '#ffc107',
    delay: '1s' // ++ Tambahkan delay
  },
]

// Fungsi untuk mengacak posisi
const generatePositions = () => [
  { top: '30%', left: '20%' },
  { top: '55%', left: '40%' },
  { top: '30%', left: '60%' },
].sort(() => Math.random() - 0.5); // Acak array posisi

export default function Dashboard({ onSelectFeature }: DashboardProps) {
  const [positions, setPositions] = useState(generatePositions());

  useEffect(() => {
    // Jika Anda ingin posisi berubah setiap refresh, state sudah menanganinya.
    // Tidak perlu aksi tambahan di sini.
  }, []);

  return (
    <div className="dashboard-container">
      {/* Navigasi Atas */}
      <header className="main-header">
        <div className="header-left">Sering</div>
        <div className="main-title">Field Project Assistant</div>
        <div className="header-right">Catatan Pencari</div>
      </header>

      {/* Menu Interaktif */}
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          color={feature.color}
          onClick={() => onSelectFeature(feature.id)}
          style={{ ...positions[index], animationDelay: feature.delay }}
        />
      ))}
    </div>
  );
}