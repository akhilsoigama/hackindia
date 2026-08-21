// components/Header/SearchButton.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { useTheme } from '@/theme/AppThemeProvider';
import HeaderActionButton from '../../components/ui/HeaderActionButton';
import { getHeaderActionClass } from '../../components/ui/headerActionButton.utils';

interface SearchButtonProps {
  isOnline: boolean;
}

const SearchButton = ({ isOnline }: SearchButtonProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSearch = (): void => setIsSearchOpen(!isSearchOpen);
  const closeSearch = (): void => setIsSearchOpen(false);

  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const inputWrapperClass = getHeaderActionClass(
    isDark,
    'justify-between overflow-hidden focus-within:ring-2 focus-within:ring-slate-500/30 w-40 sm:w-56 md:w-64 lg:w-72'
  );
  const inputClass = `w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm ${
    isDark ? 'text-gray-100 placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
  }`;
  const clearBtnClass = `ml-2 flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
    isDark ? 'bg-slate-600/80 hover:bg-slate-600' : 'bg-slate-500 hover:bg-slate-600'
  }`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      className="relative"
      ref={searchRef}
    >
      <AnimatePresence initial={false}>
        {isSearchOpen ? (
          <motion.div
            key="search-open"
            className={inputWrapperClass}
           
          >
            <FiSearch className={isDark ? 'h-4 w-4 text-gray-300' : 'h-4 w-4 text-gray-500'} />
            <input
              type="text"
              placeholder={isOnline ? 'Search lessons...' : 'Search cached lessons...'}
              className={inputClass}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button onClick={closeSearch} className={`${isDark? 'text-slate-950/70' : 'text-slate-500'} ${clearBtnClass}`} aria-label="Close search">
              <FiX className="h-3 w-3 text-white" />
            </button>
          </motion.div>
        ) : (
          <HeaderActionButton
            key="search-closed"
            isDark={isDark}
            onClick={toggleSearch}
            aria-label="Open search"
            className="gap-2"
          >
            <FiSearch className="h-4 w-4" />
            <span className="hidden lg:inline text-sm font-medium">Search</span>
          </HeaderActionButton>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchButton;