import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

interface SidebarHeaderProps {
  isSidebarExpanded: boolean;
  isMobile: boolean;
  toggleMobileSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarHeader = ({
  isSidebarExpanded,
  isMobile,
  toggleMobileSidebar,
  toggleSidebar,
}: SidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <AnimatePresence>
        {isSidebarExpanded && (
          <motion.h2
            className="text-xl font-semibold text-gray-800 tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            Dashboard
          </motion.h2>
        )}
      </AnimatePresence>

      {/* Mobile toggle */}
      {isMobile && (
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 lg:hidden"
        >
          <FiX className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* Desktop toggle */}
      {!isMobile && (
        <motion.button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 hidden lg:block"
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSidebarExpanded ? <FiX className="w-6 h-6 text-gray-600" /> : <FiMenu className="w-6 h-6 text-gray-600" />}
        </motion.button>
      )}
    </div>
  );
};

export default SidebarHeader;
