// components/Sidebar/SublinkDropdown.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';
import { useTheme } from '@/theme/AppThemeProvider';
import SidebarLinkItem from './sidebar-link-item';
import { Translated } from '../../components/common/translator/translator';

interface SublinkItem {
  to: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  subLinks?: SublinkItem[];
}

interface SublinkDropdownProps {
  subLinks: SublinkItem[];
  expandedSubLink: string | null;
  toggleSubLink: (to: string) => void;
  handleLinkClick: () => void;
  currentPath: string;
}

const SublinkDropdown: React.FC<SublinkDropdownProps> = ({
  subLinks,
  expandedSubLink,
  toggleSubLink,
  handleLinkClick,
  currentPath,
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: 0.15, ease: 'easeOut' as const };

  return (
    <AnimatePresence>
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
        transition={transition}
        className={`mt-2 space-y-1 border-l pl-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`}
      >
        {subLinks.map((subLink, index) => (
          <div key={`${subLink.to}-${index}`} className="relative">
            {subLink.subLinks && subLink.subLinks.length > 0 ? (
              <div>
                <button type="button" onClick={() => toggleSubLink(subLink.to)} className="w-full text-left group">
                  <SidebarLinkItem
                    isActive={currentPath.startsWith(subLink.to)}
                    isSidebarExpanded={true}
                    isDark={isDark}
                    isSubLink={true}
                    className="pl-6"
                  >
                    <span className="flex h-4 w-4 items-center justify-center">
                      {subLink.icon || <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    <span className="flex-1 font-medium">{subLink.label}</span>
                    <FaChevronRight
                      className={`h-3 w-3 transition-transform ${expandedSubLink === subLink.to ? 'rotate-90' : 'rotate-0'} ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    />
                  </SidebarLinkItem>
                </button>

                <AnimatePresence>
                  {expandedSubLink === subLink.to && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
                      transition={transition}
                      className={`ml-4 mt-1 space-y-1 border-l pl-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                    >
                      {subLink.subLinks.map((nestedSubLink, nestedIndex) => (
                        <NavLink
                          key={`${nestedSubLink.to}-${nestedIndex}`}
                          to={nestedSubLink.to}
                          onClick={handleLinkClick}
                          className="block"
                        >
                          {({ isActive }) => (
                            <SidebarLinkItem
                              isActive={isActive}
                              isSidebarExpanded={true}
                              isDark={isDark}
                              isSubLink={true}
                              className="pl-10"
                            >
                              <span className="flex h-3 w-3 items-center justify-center">
                                <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                              </span>
                              <span className="flex-1">
                                {typeof nestedSubLink.label === 'string' ? (
                                  <Translated text={nestedSubLink.label} />
                                ) : (
                                  nestedSubLink.label
                                )}
                              </span>
                            </SidebarLinkItem>
                          )}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink key={`${subLink.to}-${index}`} to={subLink.to} onClick={handleLinkClick} className="block">
                {({ isActive }) => (
                  <SidebarLinkItem
                    isActive={isActive}
                    isSidebarExpanded={true}
                    isDark={isDark}
                    isSubLink={true}
                    className="pl-6"
                  >
                    <span className="flex h-4 w-4 items-center justify-center">
                      {subLink.icon || <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </span>
                    <span className="flex-1 font-medium">
                      {typeof subLink.label === 'string' ? (
                        <Translated text={subLink.label} />
                      ) : (
                        subLink.label
                      )}
                    </span>
                  </SidebarLinkItem>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default SublinkDropdown;