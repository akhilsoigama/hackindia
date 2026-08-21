import { FilteredModule } from "../../types/sidebar";
import ModuleSection from "./module-section";
import { useTheme } from '@/theme/AppThemeProvider';

interface SidebarNavProps {
  modules: FilteredModule[];
  isSidebarExpanded: boolean;
  expandedLink: string | null;
  expandedSubLink: string | null;
  toggleLink: (to: string) => void;
  toggleSubLink: (to: string) => void;
  handleLinkClick: () => void;
  currentPath: string;
}

const SidebarNav = ({
  modules,
  isSidebarExpanded,
  expandedLink,
  expandedSubLink,
  toggleLink,
  toggleSubLink,
  handleLinkClick,
  currentPath,
}: SidebarNavProps) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const navClass = `flex-1 space-y-3 overflow-y-auto px-3 pb-4 pt-3 scrollbar-hide transition-colors duration-200 ${
    isDark ? ' bg-slate-950/70 text-slate-100' : 'text-slate-900'
  }`;

  return (
    <nav className={navClass}>
      {modules.map((module, moduleIndex) => (
        <div
          key={module.moduleName}
          className={`rounded-2xl  shadow-sm  ${
            isDark
              ? 'border-white/10  shadow-black/10'
              : 'border-white/60 shadow-slate-950/5'
          }`}
        >
          <ModuleSection
            module={module}
            moduleIndex={moduleIndex}
            isSidebarExpanded={isSidebarExpanded}
            expandedLink={expandedLink}
            expandedSubLink={expandedSubLink}
            toggleLink={toggleLink}
            toggleSubLink={toggleSubLink}
            handleLinkClick={handleLinkClick}
            currentPath={currentPath}
          />
        </div>
      ))}
    </nav>
  );
};

export default SidebarNav;
