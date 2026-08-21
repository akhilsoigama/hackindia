// components/Sidebar.tsx
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { modules } from "../routers/ModulePath";
import UiSidebar from '../components/ui/dashboard-with-collapsible-sidebar';
import { SidebarHeader, SidebarNav } from "../layouts/sidebar-section";
import { usePermissionsCheck } from "../hooks/usePermissionMatch";
import { Module, SidebarLink, SubLink, FilteredModule, FilteredSidebarLink } from "../types/sidebar";
import { FiLoader } from "react-icons/fi";
import { throttle } from "../utils/performance";

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
  useUiSidebar?: boolean;
}

const Sidebar = ({ isMobileOpen, toggleMobileSidebar, useUiSidebar = false }: SidebarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: 0.15, ease: 'easeOut' as const };
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const [expandedSubLink, setExpandedSubLink] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const {
    hasAnyOfPermissions,
    isSuperAdmin,
    isLoading,
    hasCachedData
  } = usePermissionsCheck();

  const filteredModules = useMemo((): FilteredModule[] => {
    if (isLoading && !hasCachedData) {
      return (modules as Module[]).map((module: Module): FilteredModule => ({
        moduleName: module.moduleName,
        permissions: module.permissions,
        links: module.links.map((link: SidebarLink): FilteredSidebarLink => ({
          to: link.to,
          label: link.label,
          icon: link.icon,
          permissions: link.permissions,
          ...(link.subLinks ? { subLinks: link.subLinks } : {})
        }))
      }));
    }

    const result = (modules as Module[])
      .map((module: Module): FilteredModule | null => {
        // 🔴 MODULE LEVEL PERMISSION CHECK - This determines if module shows up
        let hasModuleAccess = false;

        if (isSuperAdmin) {
          hasModuleAccess = true;
        } else if (module.permissions.length === 0) {
          // If no permissions defined, show module (fallback)
          hasModuleAccess = true;
        } else {
          // Check if user has ANY of the module-level permissions
          hasModuleAccess = hasAnyOfPermissions(module.permissions);
        }

        // ❌ If no module access, return null (hide entire module)
        if (!hasModuleAccess) {
          return null;
        }

        // ✅ Module is visible, now filter links
        const filteredLinks: FilteredSidebarLink[] = module.links
          .map((link: SidebarLink): FilteredSidebarLink | null => {
            let linkAccess = false;

            if (isSuperAdmin) {
              linkAccess = true;
            } else if (link.permissions.length === 0) {
              linkAccess = true;
            } else {
              linkAccess = hasAnyOfPermissions(link.permissions);
            }

            if (!linkAccess) {
              return null;
            }

            let filteredSubLinks: SubLink[] | undefined = undefined;
            if (link.subLinks && link.subLinks.length > 0) {
              filteredSubLinks = link.subLinks
                .map((subLink: SubLink): SubLink | null => {
                  let subLinkAccess = false;

                  if (isSuperAdmin) {
                    subLinkAccess = true;
                  } else if (subLink.permissions.length === 0) {
                    subLinkAccess = true;
                  } else {
                    subLinkAccess = hasAnyOfPermissions(subLink.permissions);
                  }

                  return subLinkAccess ? subLink : null;
                })
                .filter((subLink): subLink is SubLink => subLink !== null);
            }

            // If link has subLinks but none are accessible, don't show the link
            if (link.subLinks && link.subLinks.length > 0 && (!filteredSubLinks || filteredSubLinks.length === 0)) {
              return null;
            }

            const filteredLink: FilteredSidebarLink = {
              to: link.to,
              label: link.label,
              icon: link.icon,
              permissions: link.permissions,
              ...(filteredSubLinks && filteredSubLinks.length > 0 ? { subLinks: filteredSubLinks } : {})
            };

            return filteredLink;
          })
          .filter((link): link is FilteredSidebarLink => link !== null);
        
        // Return module only if it has at least one visible link
        return filteredLinks.length > 0 ? {
          moduleName: module.moduleName,
          permissions: module.permissions,
          links: filteredLinks
        } : null;
      })
      .filter((module): module is FilteredModule => module !== null);
    
    return result;
  }, [isSuperAdmin, hasAnyOfPermissions, isLoading, hasCachedData]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const throttledCheckIsMobile = throttle(checkIsMobile, 160);

    checkIsMobile();
    window.addEventListener('resize', throttledCheckIsMobile);

    return () => window.removeEventListener('resize', throttledCheckIsMobile);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;

    for (const module of filteredModules) {
      for (const link of module.links) {
        if (currentPath === link.to || currentPath.startsWith(link.to + '/')) {
          setExpandedLink(link.to);
          return;
        }

        if (link.subLinks) {
          for (const subLink of link.subLinks) {
            if (currentPath === subLink.to || currentPath.startsWith(subLink.to + '/')) {
              setExpandedLink(link.to);
              return;
            }
          }
        }
      }
    }

    setExpandedLink(null);
  }, [location.pathname, filteredModules]);

  const toggleSidebar = (): void => {
    setIsSidebarExpanded(prev => !prev);
    if (isSidebarExpanded) {
      setExpandedLink(null);
      setExpandedSubLink(null);
    }
  };

  const toggleLink = (to: string): void => {
    if (expandedLink === to) {
      setExpandedLink(null);
    } else {
      setExpandedLink(to);
    }
    setExpandedSubLink(null);
  };

  const toggleSubLink = (to: string): void => {
    if (expandedSubLink === to) {
      setExpandedSubLink(null);
    } else {
      setExpandedSubLink(to);
    }
  };

  const sidebarWidth = useMemo(() => {
    if (isMobile) {
      return '260px';
    }
    return isSidebarExpanded ? '260px' : '72px';
  }, [isMobile, isSidebarExpanded]);

  if (useUiSidebar) {
    return <UiSidebar isMobileOpen={isMobileOpen} toggleMobileSidebar={toggleMobileSidebar} />;
  }

  const handleLinkClick = () => {
    if (isMobile) {
      toggleMobileSidebar();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={toggleMobileSidebar}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0 }}
            transition={transition}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r shadow-md transition-[transform,background-color,border-color,color] duration-150 ease-in-out lg:sticky ${
          isMobile ? 'overflow-y-auto' : 'overflow-hidden'
        } overflow-x-hidden ${
          isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        } ${
          'bg-white text-gray-900 border-gray-200 dark:bg-slate-950/70 dark:text-gray-100 dark:border-gray-800'
        }`}
        style={{ width: sidebarWidth }}
        initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
        transition={transition}
      >
        <SidebarHeader
          isSidebarExpanded={isSidebarExpanded}
          isMobile={isMobile}
          toggleMobileSidebar={toggleMobileSidebar}
          toggleSidebar={toggleSidebar}
        />

        {isLoading && !hasCachedData ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <FiLoader className="mx-auto mb-2 h-5 w-5 animate-spin text-gray-400" />
              <p className="text-xs font-medium text-gray-500">Loading...</p>
            </div>
          </div>
        ) : (
          <SidebarNav
            modules={filteredModules}
            isSidebarExpanded={isSidebarExpanded}
            expandedLink={expandedLink}
            expandedSubLink={expandedSubLink}
            toggleLink={toggleLink}
            toggleSubLink={toggleSubLink}
            handleLinkClick={handleLinkClick}
            currentPath={location.pathname}
          />
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;