// components/Sidebar.tsx
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from "react";
import { modules } from "../routers/ModulePath";
import { SidebarHeader, SidebarNav } from "../layouts/sidebar-section";
import { usePermissionsCheck } from "../hooks/usePermissionMatch";
import { Module, SidebarLink, SubLink, FilteredModule, FilteredSidebarLink } from "../types/sidebar";
import { FiLoader } from "react-icons/fi";

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

const Sidebar = ({ isMobileOpen, toggleMobileSidebar }: SidebarProps) => {
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const [expandedSubLink, setExpandedSubLink] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const {
    hasAnyOfPermissions,
    userPermissionKeys,
    isSuperAdmin,
    isLoading,
    hasCachedData
  } = usePermissionsCheck();

  const filteredModules = useMemo((): FilteredModule[] => {
    // During initial load, show all modules temporarily to prevent flickering
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
        let moduleAccess = false;

        if (isSuperAdmin) {
          moduleAccess = true;
        } else if (module.permissions.length === 0) {
          moduleAccess = true;
        } else {
          moduleAccess = hasAnyOfPermissions(module.permissions);
        }

        if (!moduleAccess) {
          return null;
        }

        // Filter links
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
        
        return filteredLinks.length > 0 ? {
          moduleName: module.moduleName,
          permissions: module.permissions,
          links: filteredLinks
        } : null;
      })
      .filter((module): module is FilteredModule => module !== null);
    
    return result;
  }, [userPermissionKeys, isSuperAdmin, hasAnyOfPermissions, isLoading, hasCachedData]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
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

  const handleLinkClick = () => {
    if (isMobile) {
      toggleMobileSidebar();
    }
  };

  const sidebarWidth = useMemo(() => {
    if (isMobile) {
      return isSidebarExpanded ? '16rem' : '4rem';
    }
    return isSidebarExpanded ? '18rem' : '5rem';
  }, [isMobile, isSidebarExpanded]);

  return (
    <>
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-100 bg-opacity-75 z-50 lg:hidden"
            onClick={toggleMobileSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`h-screen fixed lg:sticky top-0 flex flex-col transition-all duration-300 overflow-y-auto scrollbar-hide ${!isMobile ? 'overflow-hidden' : 'overflow-x-auto'
          } shadow-lg z-50 bg-white ${isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
          }`}
        style={{ width: sidebarWidth }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SidebarHeader
          isSidebarExpanded={isSidebarExpanded}
          isMobile={isMobile}
          toggleMobileSidebar={toggleMobileSidebar}
          toggleSidebar={toggleSidebar}
        />

        {isLoading && !hasCachedData ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FiLoader className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-500">Loading...</p>
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