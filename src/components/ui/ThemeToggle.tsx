import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/theme/AppThemeProvider';
import HeaderActionButton from './HeaderActionButton';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === 'dark';
  const trackClass = `relative h-5 w-10 rounded-full transition-colors ${
    isDark ? 'bg-slate-700' : 'bg-slate-200'
  }`;
  const thumbClass = `absolute top-0.5 h-4 w-4 rounded-full shadow flex items-center justify-center ${
    isDark ? 'bg-amber-300' : 'bg-white'
  }`;

  return (
    <HeaderActionButton
      onClick={toggleTheme}
      aria-label="Toggle theme"
      aria-pressed={isDark}
      isDark={isDark}
      className="gap-2"
      title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={trackClass}>
        <motion.span
          className={thumbClass}
          animate={{ x: isDark ? 2 : 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        >
          {isDark ? (
            <FiSun className="h-2.5 w-2.5 text-amber-700" />
          ) : (
            <FiMoon className="h-2.5 w-2.5 text-slate-600" />
          )}
        </motion.span>
      </div>
    </HeaderActionButton>
  );
};

export default ThemeToggle;