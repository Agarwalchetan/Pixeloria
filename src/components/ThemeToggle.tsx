import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Palette, Zap, Sparkles } from 'lucide-react';

type Theme = 'light' | 'dark' | 'auto' | 'cyberpunk' | 'neon' | 'matrix';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, color: 'text-yellow-500' },
    { id: 'dark', name: 'Dark', icon: Moon, color: 'text-blue-400' },
    { id: 'auto', name: 'Auto', icon: Monitor, color: 'text-gray-400' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: Zap, color: 'text-cyan-400' },
    { id: 'neon', name: 'Neon', icon: Sparkles, color: 'text-pink-400' },
    { id: 'matrix', name: 'Matrix', icon: Palette, color: 'text-green-400' }
  ] as const;

  useEffect(() => {
    const savedTheme = localStorage.getItem('pixeloria-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'cyberpunk', 'neon', 'matrix');
    
    switch (newTheme) {
      case 'light':
        root.classList.add('light');
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8fafc');
        root.style.setProperty('--text-primary', '#1f2937');
        break;
      case 'dark':
        root.classList.add('dark');
        root.style.setProperty('--bg-primary', '#111827');
        root.style.setProperty('--bg-secondary', '#1f2937');
        root.style.setProperty('--text-primary', '#f9fafb');
        break;
      case 'cyberpunk':
        root.classList.add('cyberpunk');
        root.style.setProperty('--bg-primary', '#0a0a0a');
        root.style.setProperty('--bg-secondary', '#1a1a2e');
        root.style.setProperty('--text-primary', '#00ffff');
        document.body.style.background = 'linear-gradient(45deg, #0a0a0a, #1a1a2e, #16213e)';
        break;
      case 'neon':
        root.classList.add('neon');
        root.style.setProperty('--bg-primary', '#0d0d0d');
        root.style.setProperty('--bg-secondary', '#1a0d1a');
        root.style.setProperty('--text-primary', '#ff00ff');
        document.body.style.background = 'linear-gradient(45deg, #0d0d0d, #1a0d1a, #2d1b2d)';
        break;
      case 'matrix':
        root.classList.add('matrix');
        root.style.setProperty('--bg-primary', '#000000');
        root.style.setProperty('--bg-secondary', '#001100');
        root.style.setProperty('--text-primary', '#00ff41');
        document.body.style.background = 'linear-gradient(45deg, #000000, #001100, #002200)';
        break;
      case 'auto':
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
        return;
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('pixeloria-theme', newTheme);
    setIsOpen(false);
  };

  const currentTheme = themes.find(t => t.id === theme);

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
      >
        {currentTheme && (
          <currentTheme.icon 
            size={18} 
            className={`${currentTheme.color} transition-colors duration-300`} 
          />
        )}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute top-12 right-0 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl p-2 min-w-[160px] z-50"
        >
          {themes.map((themeOption) => (
            <motion.button
              key={themeOption.id}
              whileHover={{ x: 4 }}
              onClick={() => handleThemeChange(themeOption.id as Theme)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                theme === themeOption.id
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
              }`}
            >
              <themeOption.icon size={16} className={themeOption.color} />
              <span className="text-sm font-medium">{themeOption.name}</span>
              {theme === themeOption.id && (
                <motion.div
                  layoutId="activeTheme"
                  className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ThemeToggle;