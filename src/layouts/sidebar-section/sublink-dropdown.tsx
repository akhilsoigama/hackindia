// components/Sidebar/SublinkDropdown.tsx
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

interface SublinkDropdownProps {
  subLinks: any[];
  expandedSubLink: string | null;
  toggleSubLink: (to: string) => void;
  handleLinkClick: () => void;
  currentPath: string;
}

const SublinkDropdown = ({
  subLinks,
  expandedSubLink,
  toggleSubLink,
  handleLinkClick,
  currentPath
}: SublinkDropdownProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-2"
      >
        {subLinks.map((subLink: any, index: number) => (
          <div key={`${subLink.to}-${index}`} className="relative"> {/* Unique key banaya */}
            {subLink.subLinks ? (
              <button
                onClick={() => toggleSubLink(subLink.to)}
                className={`flex items-center p-2 pl-4 rounded-lg transition-all duration-300 w-full group/sublink ${currentPath.startsWith(subLink.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-blue-50 text-gray-500 hover:text-gray-800'
                  }`}
              >
                <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md transition-colors ${expandedSubLink === subLink.to
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-400 group-hover/sublink:bg-gray-200'
                  }`}>
                  {subLink.icon || <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>

                <span className="ml-3 font-medium text-sm">{subLink.label}</span>

                {subLink.subLinks && (
                  <motion.div
                    className="ml-auto text-gray-400 transition-transform"
                    animate={{ rotate: expandedSubLink === subLink.to ? 90 : 0 }}
                  >
                    <FaChevronRight className="w-2.5 h-2.5" />
                  </motion.div>
                )}
              </button>
            ) : (
              <NavLink
                to={subLink.to}
                className={({ isActive }) =>
                  `flex items-center p-2 pl-4 rounded-lg transition-all duration-300 group/sublink ${isActive
                    ? 'bg-blue-50 text-blue-800 font-semibold'
                    : 'hover:bg-blue-50 text-gray-500 hover:text-gray-800'
                  }`
                }
                onClick={handleLinkClick}
              >
                <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md transition-colors ${subLink.icon ? '' : 'bg-gray-100 group-hover/sublink:bg-gray-200'
                  }`}>
                  {subLink.icon || <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>

                <span className="ml-3 font-medium text-sm">{subLink.label}</span>
              </NavLink>
            )}

            {/* Nested sublinks */}
            {subLink.subLinks && expandedSubLink === subLink.to && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2"
                >
                  {subLink.subLinks.map((nestedSubLink: any, nestedIndex: number) => (
                    <NavLink
                      key={`${nestedSubLink.to}-${nestedIndex}`} 
                      to={nestedSubLink.to}
                      className={({ isActive }) =>
                        `flex items-center p-2 pl-4 rounded-md transition-all duration-300 text-sm group/nested ${isActive
                          ? 'text-blue-700 font-medium'
                          : 'text-gray-400 hover:text-gray-700 hover:bg-blue-25'
                        }`
                      }
                      onClick={handleLinkClick}
                    >
                      <div className="flex-shrink-0 w-3 h-3 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-current opacity-60" />
                      </div>
                      <span className="ml-3">{nestedSubLink.label}</span>
                    </NavLink>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default SublinkDropdown;