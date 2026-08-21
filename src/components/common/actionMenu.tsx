// components/common/ActionMenu.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaEllipsisV } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/theme/AppThemeProvider';
import { throttle } from '../../utils/performance';

export interface ActionMenuItem {
  label: string | React.ReactNode;
  onClick: (data: unknown) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
}

interface ActionMenuProps<T = unknown> {
  items: ActionMenuItem[];
  data: T;
  className?: string;
}

const ActionMenu = <T,>({ items, data, className = '' }: ActionMenuProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const {mode} = useTheme()
  const isDark = mode === 'dark';

  const getVariantStyles = (variant: string = 'default') => {
    const styles = {
      default: isDark ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50',
      danger: isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50',
      warning: isDark ? 'text-orange-400 hover:bg-orange-900/20' : 'text-orange-600 hover:bg-orange-50',
      success: isDark ? 'text-green-400 hover:bg-green-900/20' : 'text-green-600 hover:bg-green-50'
    };
    return styles[variant as keyof typeof styles] || styles.default;
  };

  const calculateMenuPosition = useCallback(() => {
    if (!anchorRef.current) return null;
    
    const rect = anchorRef.current.getBoundingClientRect();
    const menuWidth = 200;
    const menuHeight = items.length * 42 + 16; 
    const margin = 8;

    let top = rect.bottom + margin;
    let left = rect.right - menuWidth;

    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + menuWidth > viewportWidth - margin) {
      left = viewportWidth - menuWidth - margin;
    }

    if (left < margin) {
      left = margin;
    }

    if (top + menuHeight > viewportHeight - margin) {
      top = rect.top - menuHeight - margin;
    }

    if (top < margin) {
      top = margin;
    }

    return { top, left };
  }, [items.length]);

  const openMenu = useCallback(() => {
    const position = calculateMenuPosition();
    if (position) {
      setCoords(position);
      setIsOpen(true);
    }
  }, [calculateMenuPosition]);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOpen) closeMenu();
    else openMenu();
  };

  const handleItemClick = (item: ActionMenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!item.disabled) {
      item.onClick(data);
      closeMenu();
    }
  };

  // Close menu if click outside or scroll
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (anchorRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      closeMenu();
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    const handleScroll = throttle(() => {
      closeMenu();
    }, 120);

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, closeMenu]);

  const menu = (
    <AnimatePresence>
      {isOpen && coords && (
        <motion.div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 9999,
          }}
          className={`w-48 rounded-lg shadow-md border ${isDark ? 'bg-gray-900 text-gray-100 border-gray-800' : 'bg-white text-gray-900 border-gray-200'}`}
          initial={{ opacity: 0, y: -5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={(e) => handleItemClick(item, e)}
                disabled={item.disabled}
                className={`w-full px-4 py-2.5 text-sm flex items-center transition-colors duration-150 ${
                  getVariantStyles(item.variant)
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {item.icon && <span className="mr-3 shrink-0 text-xs">{item.icon}</span>}
                <span className="text-left flex-1">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative inline-flex">
      <button
        ref={anchorRef}
        onClick={handleToggle}
        className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} ${className}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
      >
        <FaEllipsisV className="text-sm" />
      </button>
      {createPortal(menu, document.body)}
    </div>
  );
};

export default ActionMenu;