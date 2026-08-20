import { FilteredModule } from "../../types/sidebar";
import ModuleSection from "./module-section";

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
  return (
    <nav className="flex-1 p-4 space-y-2">
      {modules.map((module, moduleIndex) => (
        <ModuleSection
          key={module.moduleName}
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
      ))}
    </nav>
  );
};

export default SidebarNav;
