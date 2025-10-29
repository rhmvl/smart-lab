import { useState, useEffect } from 'react';

export function SplashScreen() {
  const loadingMessages = [
    'Menyiapkan Smart Lab...',
    'Memuat model AI...',
    'Menginisialisasi kalkulator sains...',
    'Membangun antarmuka interaktif...',
    'Hampir selesai...'
  ];

  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex(i => (i + 1) % loadingMessages.length);
    }, 1500);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.random() * 10; // simulate loading
      });
    }, 400);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-all">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner */}
        <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />

        {/* Dynamic Loading Text */}
        <div className="text-center">
          <p className="text-lg font-medium transition-opacity duration-500">
            {loadingMessages[messageIndex]}
          </p>
          <p className="text-sm text-gray-500 mt-1">{Math.min(progress, 100).toFixed(0)}%</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

