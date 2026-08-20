import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import SublinkDropdown from './sublink-dropdown';
import { ReactNode, useEffect, useState } from 'react';
import useTranslateWithAtom from "../../action/translate";

// Translated component
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
    return () => {
      mounted = false;
    };
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

const NavigationLink = ({
  link,
  moduleIndex,
  linkIndex,
  isSidebarExpanded,
  expandedLink,
  expandedSubLink,
  toggleLink,
  toggleSubLink,
  handleLinkClick,
  currentPath
}: NavigationLinkProps) => {
  const isExpanded = expandedLink === link.to;

  if (link.subLinks) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: (moduleIndex * 0.15) + (linkIndex * 0.08),
          duration: 0.4,
          type: "spring",
          stiffness: 200
        }}
        className="relative"
      >
        <div className="relative">
          <button
            onClick={() => toggleLink(link.to)}
            className={`flex items-center p-3 rounded-xl transition-all duration-300 group w-full relative overflow-hidden ${
              isExpanded
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm shadow-blue-100'
                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900 hover:shadow-sm'
            } ${!isSidebarExpanded ? 'justify-center px-3' : ''}`}
          >
            {/* Active indicator */}
            {isExpanded && (
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"
                layoutId="activeIndicator"
              />
            )}

            <div className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'text-blue-500 scale-110' : 'text-gray-400'} ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
              {link.icon}
            </div>

            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.span
                  className="ml-3 font-medium flex-1 text-left"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Translated text={link.label} />
                </motion.span>
              )}
            </AnimatePresence>

            {link.subLinks && isSidebarExpanded && (
              <motion.div
                className="ml-2 text-gray-400 transition-all duration-300"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <FaChevronDown className="w-3 h-3" />
              </motion.div>
            )}

            {/* Tooltip for collapsed sidebar */}
            {!isSidebarExpanded && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 shadow-lg whitespace-nowrap">
                <div className="font-medium">
                  <Translated text={link.label} />
                </div>
                {link.subLinks && (
                  <div className="text-xs text-gray-300 mt-1">
                    {link.subLinks.length} items
                  </div>
                )}
              </div>
            )}
          </button>

          {/* Sublinks dropdown */}
          {link.subLinks && isExpanded && isSidebarExpanded && (
            <SublinkDropdown
              subLinks={link.subLinks.map(sub => ({
                ...sub,
                label: <Translated text={sub.label} /> // translate each sublink label
              }))}
              expandedSubLink={expandedSubLink}
              toggleSubLink={toggleSubLink}
              handleLinkClick={handleLinkClick}
              currentPath={currentPath}
            />
          )}
        </div>
      </motion.div>
    );
  }

  // Single link without sublinks
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: (moduleIndex * 0.15) + (linkIndex * 0.08),
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }}
      className="relative"
    >
      <NavLink
        to={link.to}
        onClick={handleLinkClick}
        end
        className={({ isActive }) =>
          `flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
            isActive
              ? 'bg-blue-100 text-blue-800 font-semibold'
              : 'hover:bg-blue-50 text-gray-600 hover:text-gray-900'
          } ${!isSidebarExpanded ? 'justify-center px-3' : ''}`
        }
      >
        <div className={`flex-shrink-0 ${!isSidebarExpanded ? 'mx-auto' : ''}`}>
          {link.icon}
        </div>

        {isSidebarExpanded && (
          <span className="ml-3 font-medium flex-1">
            <Translated text={link.label} />
          </span>
        )}

        {/* Tooltip for collapsed sidebar */}
        {!isSidebarExpanded && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 shadow-lg whitespace-nowrap">
            <Translated text={link.label} />
          </div>
        )}
      </NavLink>
    </motion.div>
  );
};

export default NavigationLink;
