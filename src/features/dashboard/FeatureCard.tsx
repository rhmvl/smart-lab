import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string; // e.g. '#6366f1'
  onClick: () => void;
  style?: React.CSSProperties;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  onClick,
  style = {},
}: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        '--glow-color': color,
      } as CSSProperties}
      className={`
        absolute w-[180px] h-[180px]
        bg-white/80 backdrop-blur-md border border-white/30
        rounded-2xl shadow-lg cursor-pointer
        flex flex-col items-center justify-center text-center
        transition-transform duration-300 ease-in-out
        animate-zero-gravity hover:scale-105 hover:-translate-y-3
        hover:shadow-[0_16px_40px_rgba(0,0,0,0.15),0_0_20px_var(--glow-color)]
        group
      `}
    >
      <div className="mb-3">
        <Icon size={48} color={color} strokeWidth={2.2} />
      </div>
      <div className="text-[18px] font-bold text-gray-800 dark:text-gray-100">
        {title}
      </div>
      <div
        className={`
          absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[90%]
          bg-gray-800 text-white text-sm rounded-lg px-3 py-2
          opacity-0 invisible group-hover:visible group-hover:opacity-100
          group-hover:bottom-[-40px]
          transition-all duration-300 ease-in-out pointer-events-none
        `}
      >
        {description}
      </div>
    </div>
  );
}

