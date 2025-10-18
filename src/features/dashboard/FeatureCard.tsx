import React from 'react';
import './FeatureCard.css';

interface FeatureCardProps {
  icon: string; // Kita bisa pakai emoji atau path gambar SVG
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  style: React.CSSProperties; // Untuk posisi acak
}

export default function FeatureCard({ icon, title, description, color, onClick, style }: FeatureCardProps) {
  return (
    <div className="feature-card" onClick={onClick} style={{ ...style, '--glow-color': color } as React.CSSProperties}>
      <img src={icon} alt={title} className="card-icon-image" />
      <div className="card-title">{title}</div>
      <div className="card-description">
        <p>{description}</p>
      </div>
    </div>
  );
}