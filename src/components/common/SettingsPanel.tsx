import { useTheme } from '../../utils/useTheme';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      {/* Prevent click inside from closing */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl shadow-2xl w-[90%] max-w-md transform transition-all duration-300 scale-100 p-6 border border-white/20 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Looks
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Theme Selector */}
        <div className="space-y-3">
          <p className="font-medium text-gray-700 dark:text-gray-300">Pilih Tema:</p>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all
                ${theme === 'light'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Light
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all
                ${theme === 'dark'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/*
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-3">Audio:</p>
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-700 dark:text-gray-300 font-medium">Musik Latar (BGM)</label>
            <button className="py-1 px-4 rounded-md text-sm font-semibold border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              OFF
            </button>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300 font-medium">Efek Suara (SFX)</label>
            <button className="py-1 px-4 rounded-md text-sm font-semibold border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              OFF
            </button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}

