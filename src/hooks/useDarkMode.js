import { useEffect, useState } from 'react';

const storageKey = 'bahria-notice-board-theme';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, setIsDark };
}
