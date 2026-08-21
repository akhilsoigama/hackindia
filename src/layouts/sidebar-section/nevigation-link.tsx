import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import SublinkDropdown from './sublink-dropdown';
import { ReactNode, useEffect, useState } from 'react';
import useTranslateWithAtom from "../../action/translate";
import { useTheme } from '@/theme/AppThemeProvider';
import SidebarLinkItem from './sidebar-link-item';

const Translated = ({ text }: { text: string }) => {
  const { translateText, currentLanguage } = useTranslateWithAtom();
  const [translated, setTranslated] = useState<string>(text);

  useEffect(() => {
    let mounted = true;
    const doTranslate = async () => {
      if (!text) return;
      const result = await translateText(text);
      if (mounted && result) setTranslated(result);
    };
    doTranslate();
    return () => { mounted = false; };
  }, [text, currentLanguage, translateText]);

  return <>{translated}</>;
};

interface SubLink {
  label: string;
  to: string;
  icon?: ReactNode;
}

interface NavigationLinkType {
  label: string;
  to: string;
  icon: ReactNode;
  subLinks?: SubLink[];
}

interface NavigationLinkProps {
  link: NavigationLinkType;
  moduleIndex: number;
  linkIndex: number;
  isSidebarExpanded: boolean;
  expandedLink: string | null;
  expandedSubLink: string | null;
  toggleLink: (to: string) => void;
  toggleSubLink: (to: string) => void;
  handleLinkClick: () => void;
  currentPath: string;
}

const CollapsedFlyout = ({
  link,
  isDark,
  currentPath,
  handleLinkClick,
}: {
  link: NavigationLinkType;
  isDark: boolean;
  currentPath: string;
  handleLinkClick: () => void;
}) => {
  const navigate = useNavigate();

  if (!link.subLinks || link.subLinks.length === 0) {
    return (
      <div className="py-2 px-1">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          <Translated text={link.label} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Section header */}
      <div
        className={`px-4 py-1.5 mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] border-b ${
          isDark ? 'text-gray-500 border-gray-800' : 'text-gray-400 border-gray-100'
        }`}
      >
        <Translated text={link.label} />
      </div>

      {/* Sublink items */}
      <div className="px-1 mt-1 flex flex-col gap-0.5">
        {link.subLinks.map((sub) => {
          const isSubActive = currentPath === sub.to || currentPath.startsWith(sub.to + '/');
          return (
            <button
              key={sub.to}
              onClick={() => {
                navigate(sub.to);
                handleLinkClick();
              }}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left
                text-xs font-medium transition-colors duration-150
                ${isSubActive
                  ? isDark
                    ? 'bg-slate-950/70 text-slate-300'
                    : 'bg-slate-50 text-slate-700'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-800/80 hover:text-gray-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {sub.icon && (
                <span className={`h-3.5 w-3.5 shrink-0 flex items-center justify-center ${
                  isSubActive
                    ? isDark ? 'text-slate-400' : 'text-slate-500'
                    : isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {sub.icon}
                </span>
              )}
              <Translated text={sub.label} />
              {isSubActive && (
                <span className={`ml-auto h-1.5 w-1.5 rounded-full shrink-0 ${
                  isDark ? 'bg-slate-400' : 'bg-slate-500'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Simple tooltip for links without sublinks
const CollapsedSimpleTooltip = ({
  label,
  isDark,
}: {
  label: string;
  isDark: boolean;
}) => (
  <div className="py-2 px-4">
    <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      <Translated text={label} />
    </span>
  </div>
);

const NavigationLink = ({
  link,
  moduleIndex: _moduleIndex,
  linkIndex: _linkIndex,
  isSidebarExpanded,
  expandedLink,
  expandedSubLink,
  toggleLink,
  toggleSubLink,
  handleLinkClick,
  currentPath,
}: NavigationLinkProps) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: 0.15, ease: 'easeOut' as const };
  const isExpanded = expandedLink === link.to;
  const isActive = currentPath === link.to || currentPath.startsWith(link.to + '/');

  const iconClass = `flex h-5 w-5 items-center justify-center shrink-0 ${
    isActive
      ? isDark ? 'text-slate-300' : 'text-slate-600'
      : isDark ? 'text-gray-400' : 'text-gray-500'
  }`;

  if (link.subLinks) {
    return (
      <div className="relative">
        <button onClick={() => toggleLink(link.to)} className="w-full text-left">
          <SidebarLinkItem
            isActive={isExpanded || isActive}
            isSidebarExpanded={isSidebarExpanded}
            isDark={isDark}
            tooltip={
              <CollapsedFlyout
                link={link}
                isDark={isDark}
                currentPath={currentPath}
                handleLinkClick={handleLinkClick}
              />
            }
          >
            {(isExpanded || isActive) && (
              <span
                className={`absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full ${
                  isDark ? 'bg-slate-950/70' : 'bg-slate-600'
                }`}
              />
            )}

            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              isActive
                ? isDark ? 'bg-slate-950/70 text-slate-200' : 'bg-slate-50 text-slate-600'
                : isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <span className={iconClass}>{link.icon}</span>
            </span>

            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.span
                  className={`flex-1 text-left text-sm font-medium truncate ${
                    isExpanded || isActive
                      ? isDark ? 'text-slate-200' : 'text-slate-700'
                    : isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, x: -6 }}
                  transition={transition}
                >
                  <Translated text={link.label} />
                </motion.span>
              )}
            </AnimatePresence>

            {isSidebarExpanded && (
              <span
                className={`shrink-0 ${
                  isExpanded || isActive
                    ? isDark ? 'text-slate-200' : 'text-slate-500'
                    : isDark ? 'text-slate-500' : 'text-slate-400'
                } transition-transform duration-150 ease-out ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              >
                <FaChevronDown className="h-3 w-3" />
              </span>
            )}
          </SidebarLinkItem>
        </button>

        {isExpanded && isSidebarExpanded && (
          <SublinkDropdown
            subLinks={link.subLinks.map((sub) => ({
              ...sub,
              label: typeof sub.label === 'string' ? sub.label : (sub.label as unknown as string),
            }))}
            expandedSubLink={expandedSubLink}
            toggleSubLink={toggleSubLink}
            handleLinkClick={handleLinkClick}
            currentPath={currentPath}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <NavLink to={link.to} onClick={handleLinkClick} end className="block">
        {({ isActive }) => (
          <SidebarLinkItem
            isActive={isActive}
            isSidebarExpanded={isSidebarExpanded}
            isDark={isDark}
            tooltip={
              <CollapsedSimpleTooltip label={link.label} isDark={isDark} />
            }
          >
            {isActive && (
              <motion.span
                className={`absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full ${
                  isDark ? 'bg-slate-800' : 'bg-slate-600'
                }`}
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={shouldReduceMotion ? {} : { opacity: 1 }}
                transition={transition}
              />
            )}

            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              isActive
                ? isDark ? 'bg-slate-800/15 text-slate-200' : 'bg-slate-50 text-slate-600'
                : isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <span className={iconClass}>{link.icon}</span>
            </span>

            {isSidebarExpanded && (
              <motion.span
                className={`flex-1 text-left text-sm font-medium truncate ${
                  isActive
                    ? isDark ? 'text-slate-200' : 'text-slate-700'
                    : isDark
                      ? 'text-slate-300 group-hover:text-slate-100'
                      : 'text-slate-700 group-hover:text-slate-900'
                }`}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, x: -6 }}
                transition={transition}
              >
                <Translated text={link.label} />
              </motion.span>
            )}
          </SidebarLinkItem>
        )}
      </NavLink>
    </div>
  );
};

export default NavigationLink;