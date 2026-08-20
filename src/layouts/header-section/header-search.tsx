// components/Header/SearchButton.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchButtonProps {
  isOnline: boolean;
}

const SearchButton = ({ isOnline }: SearchButtonProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSearch = (): void => setIsSearchOpen(!isSearchOpen);
  const closeSearch = (): void => setIsSearchOpen(false);

  // Close search when clicking outside
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isSearchOpen ? (
        <motion.div
          className="flex items-center bg-gray-100 rounded-full shadow-sm pl-2 pr-1.5 py-1 w-28 xs:w-40 sm:w-48 md:w-64 lg:w-80 border border-gray-300"
          initial={{ width: 32 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            placeholder={isOnline ? 'Search lessons...' : 'Search cached lessons...'}
            className="w-full bg-transparent border-none text-gray-800 focus:outline-none focus:ring-0 text-xs sm:text-sm"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={closeSearch}
            className="ml-1 p-1 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
          >
            <FiX className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" />
          </button>
        </motion.div>
      ) : (
        <motion.button
          onClick={toggleSearch}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm border border-gray-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSearch className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-600" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchButton;