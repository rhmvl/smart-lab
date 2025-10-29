import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('smartlab-theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('smartlab-theme', theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem('smartlab-theme') || 'light';
    document.documentElement.classList.add(saved);
  }, []);

  return { theme, setTheme };
}
