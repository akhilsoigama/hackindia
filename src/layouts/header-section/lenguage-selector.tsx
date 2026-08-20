// components/Header/LanguageSelector.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';
import { atom, useAtom } from 'jotai';

export const languageAtom = atom('en'); 

interface Language {
  code: string;
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
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  ];

  const toggleLanguagePanel = () => setShowLanguagePanel(!showLanguagePanel);
  const closeLanguagePanel = () => setShowLanguagePanel(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        closeLanguagePanel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    setCurrentLanguage(code);
    closeLanguagePanel();
  };

  const selectedLanguage = languages.find(lang => lang.code === currentLanguage);
  return (
    <motion.div
      className="relative"
      ref={languageRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <motion.button
        onClick={toggleLanguagePanel}
        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm border border-gray-300 flex items-center gap-1.5"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiGlobe className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-600" />
        {selectedLanguage && currentLanguage !== 'en' && (
          <span className="text-xs sm:text-sm font-medium text-gray-700 pr-1">
            {selectedLanguage.nativeName}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {showLanguagePanel && (
          <motion.div
            className="absolute right-0 mt-2 w-36 sm:w-40 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 z-40"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 sm:p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-xs sm:text-sm">Select Language</h3>
            </div>
            <div className="py-1">
              {languages.map(language => (
                <button
                  key={language.code}
                  className={`w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors flex items-center ${
                    currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="mr-2">{language.nativeName}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    ({language.name})
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
