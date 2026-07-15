import React, { useLayoutEffect, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useLayoutEffect(() => {
    // Check initial state from local storage or system preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button 
      onClick={toggleDarkMode}
      className="p-2 rounded-full border border-forest/20 dark:border-sand/20 hover:bg-forest hover:text-[#fdfbf7] dark:hover:bg-transparent dark:hover:text-forest text-forest dark:text-[#fdfbf7] bg-white/90 dark:bg-transparent backdrop-blur-md shadow-lg dark:shadow-none transition-all duration-300"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default DarkModeToggle;
