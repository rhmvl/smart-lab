import { useState } from 'react';
import FeatureCard from './FeatureCard';
import './Dashboard.css';
import { type LucideIcon } from 'lucide-react';
import { WEB_PAGE } from '../../utils/config';

interface DashboardProps {
  onSelectFeature: (feature: string, icon: LucideIcon, color: string) => void;
}

// TODO: Maybe dashboard ui is not right

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
    <div className="flex flex-col items-center justify-center p-8 pt-24 min-h-screen">
      <div className="dashboard-container">
        {WEB_PAGE.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            onClick={() => onSelectFeature(feature.id, feature.icon, feature.color)}
            style={{
              ...positions[index],
              animationDelay: `${feature.delay}, 1s`,
              animationName: `${shuffledAnimations[index]}, zero-gravity`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
