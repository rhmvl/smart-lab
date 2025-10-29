
import { type CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  style?: CSSProperties;
  className?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  onClick,
  style = {},
  className = '',
}: FeatureCardProps) {
  const combinedClassName = `group absolute ${className}
    w-[180px] min-h-[180px] p-5
    bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm
    border border-white/20 dark:border-gray-700/30
    rounded-2xl shadow-lg cursor-pointer
    flex flex-col items-center justify-start pt-6 text-center
    text-gray-800 dark:text-gray-100
    transition-all duration-300 ease-in-out
    hover:scale-105 hover:-translate-y-3
    hover:shadow-[0_16px_40px_rgba(0,0,0,0.15),0_0_20px_var(--glow-color)]`;

  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        '--glow-color': color,
        willChange: style.willChange,
        animation: style.animation,
        animationDelay: style.animationDelay,
      } as CSSProperties}
      className={combinedClassName}
    >
      <div className="card-content-wrapper flex flex-col items-center justify-center">
        <div className="mb-3">
          <Icon size={48} color={color} strokeWidth={2.2} />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      {/* Tooltip Deskripsi */}
      <div
        className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[90%]
          bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-200
          text-xs rounded-lg px-2 py-1 shadow-md
          opacity-0 invisible group-hover:visible group-hover:opacity-100
          group-hover:bottom-[-35px] transition-all duration-300 ease-in-out
          pointer-events-none`}
      >
        <p className="m-0">{description}</p>
      </div>
    </div>
  );
}

