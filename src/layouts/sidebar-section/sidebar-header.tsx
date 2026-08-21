import { motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useTheme } from "@/theme/AppThemeProvider";
import { LuChevronLeft } from "react-icons/lu";
import RuralSparkLogo from "../../components/ui/RuralSparkLogo";
import { Translated } from "../../components/common/translator/translator";

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
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: 0.15, ease: "easeOut" as const };

  const toggleBtnClass = `
    flex h-7 w-7 flex-shrink-0 items-center justify-center
    rounded-lg border ${isDark ? "border-gray-800" : "border-gray-300"} transition-all duration-200 ease-in-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40
    ${
      isDark
        ? "bg-slate-950/70 text-gray-400 hover:bg-gray-700 hover:text-gray-200 hover:border-gray-600"
        : "bg-white  text-gray-500 hover:bg-gray-200/80 hover:text-gray-800 hover:border-gray-300"
    }
  `;

  // ── Mobile layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className={`flex items-center gap-6 ${isDark ? "bg-slate-950/70" : "bg-white"} px-4 py-4`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl  ring-1 bg-transparent`}
        >
          <RuralSparkLogo
            isDark={isDark}
            showSubtitle={false}
            iconClassName="h-9 w-9" 
          />
        </div>

        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          transition={transition}
          className={`flex-1  min-w-0 truncate text-sm font-semibold tracking-tight ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <Translated text="Dashboard" />
        </motion.h2>

        <button
          onClick={toggleMobileSidebar}
          className={toggleBtnClass}
          aria-label="Close sidebar"
        >
          <FiX className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  if (isSidebarExpanded) {
    return (
      <div
        className={`flex items-center gap-3 ${isDark ? "bg-slate-950/70" : "bg-white"} px-4 py-4`}
      >
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={transition}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-transparent`}
        >
          <RuralSparkLogo isDark={isDark} showSubtitle={false} iconClassName="h-12 w-12 scale-[1]"/>
        </motion.div>

        <motion.h2
          initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, x: -6 }}
          transition={transition}
          className={`flex-1 min-w-0 truncate text-sm font-semibold tracking-tight ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <Translated text="Dashboard" />
        </motion.h2>

        <button
          onClick={toggleSidebar}
          className={`${toggleBtnClass} hidden lg:flex`}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <LuChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 justify-center ${isDark ? "bg-slate-950/70" : "bg-white"} px-4 py-4`}
    >
      <button
        onClick={toggleSidebar}
        className={`${toggleBtnClass} hidden lg:flex`}
        aria-label="Expand sidebar"
        title="Expand sidebar"
      >
        <LuChevronLeft className="h-3.5 w-3.5 rotate-180" />
      </button>
    </div>
  );
};

export default SidebarHeader;
