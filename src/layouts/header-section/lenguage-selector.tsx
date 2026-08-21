// components/Header/LanguageSelector.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';
import { useTheme } from '@/theme/AppThemeProvider';
import { useAtom } from 'jotai';
import HeaderActionButton from '../../components/ui/HeaderActionButton';
import { languageAtom, type SupportedLanguage } from '../../atoms/languageAtom';

interface Language {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

const LanguageSelector = () => {
  const [showLanguagePanel, setShowLanguagePanel] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useAtom(languageAtom);
  const languageRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  ];

  const toggleLanguagePanel = () => setShowLanguagePanel(!showLanguagePanel);
  const closeLanguagePanel = () => setShowLanguagePanel(false);

  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const globeClass = `${isDark ? 'text-gray-200' : 'text-gray-600'} h-4 w-4`;
  const nameClass = `${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium`;
  const panelClass = `absolute right-0 mt-3 w-44 sm:w-48 rounded-xl overflow-hidden z-40 border shadow-xl ${isDark ? 'bg-gray-900 text-gray-100 border-gray-800' : 'bg-white text-gray-800 border-gray-200'
    }`;
  const panelHeaderClass = `px-4 py-3 border-b ${isDark ? 'border-gray-800 bg-gray-800/70' : 'border-gray-100 bg-gray-50'}`;
  const itemActive = isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-700';
  const itemInactive = isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-50 text-gray-800';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        closeLanguagePanel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: SupportedLanguage) => {
    setCurrentLanguage(code);
    closeLanguagePanel();
  };

  const selectedLanguage = languages.find(lang => lang.code === currentLanguage);
  return (
    <motion.div
      className="relative"
      ref={languageRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <HeaderActionButton
        isDark={isDark}
        onClick={toggleLanguagePanel}
        aria-label="Select language"
        aria-haspopup="menu"
        aria-expanded={showLanguagePanel}
        className="gap-2"
      >
        <FiGlobe className={globeClass} />
        <span className={`hidden lg:inline ${nameClass}`}>
          {selectedLanguage?.nativeName || 'English'}
        </span>
      </HeaderActionButton>

      <AnimatePresence>
        {showLanguagePanel && (
          <motion.div
            className={panelClass}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="menu"
          >
            <div className={panelHeaderClass}>
              <h3 className="font-semibold text-xs sm:text-sm">Select Language</h3>
            </div>
            <div className="py-1">
              {languages.map(language => (
                <button
                  key={language.code}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${currentLanguage === language.code ? itemActive : itemInactive
                    }`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="font-medium">{language.nativeName}</span>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {language.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LanguageSelector;
