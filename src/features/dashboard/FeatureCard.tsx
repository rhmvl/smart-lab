import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  style?: CSSProperties;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  onClick,
  style = {},
}: FeatureCardProps) {
  const combinedClassName = `group absolute w-[180px] min-h-[180px] p-5 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg cursor-pointer flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-100 transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-3 hover:shadow-[0_16px_40px_rgba(0,0,0,0.15),0_0_20px_var(--glow-color)]`;
  
  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        '--glow-color': color,
        '--animation-delay': style.animationDelay?.split(',')[0] || '2s',
      } as CSSProperties}
      className={combinedClassName}
    >
      <div className="card-content-wrapper flex flex-col items-center justify-center">
        <div className="mb-3">
          <Icon size={48} color={color} strokeWidth={2.2} />
        </div>
        <div className="text-[18px] font-bold"> 
          {title}
        </div>
      </div>
      {/* Deskripsi */}
      <div className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[90%] bg-gray-300 dark:bg-gray-700 text-black dark:text-gray-200 text-sm rounded-lg px-3 py-2 shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:bottom-[-40px] transition-all duration-300 ease-in-out pointer-events-none`}>      
        <p className="m-0">{description}</p> 
      </div>
    </div>
  );
}
