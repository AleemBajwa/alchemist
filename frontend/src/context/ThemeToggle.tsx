'use client';

import { useTheme } from '../context/ThemeContext';

const themes = ['light', 'dark', 'notebook', 'ai-grid'];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={cycleTheme}
      className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
    >
      Theme: {theme}
    </button>
  );
}
