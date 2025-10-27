import { type LucideIcon } from "lucide-react";

interface TransitionOverlayProps {
  isTransitioning: boolean;
  icon: LucideIcon;
  color: string;
}

export const TransitionOverlay = ({ isTransitioning, icon: Icon, color }: TransitionOverlayProps) => (
  <div 
    className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-900 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
    style={{ transitionProperty: 'opacity' }}
  >  
    <div className="absolute inset-0 bg-white dark:bg-gray-800 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-float-react">
          <div className="mb-3">
            <Icon size={48} color={color} strokeWidth={2.2} />
          </div>
        </div>
        <div className="w-[100px] h-5 bg-black/20 rounded-full blur-md mt-4 animate-float-shadow-react"></div>
      </div>
    </div>
  </div>
);
