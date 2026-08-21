import { modules } from '../../routers/ModulePath';
import { usePermissionsCheck } from '../../hooks/usePermissionMatch';
import { useLocation } from 'react-router-dom';
import { FilteredModule, FilteredSidebarLink, Module, SidebarLink, SubLink } from '../../types/sidebar';
import SidebarHeader from '../../layouts/sidebar-section/sidebar-header';
import SidebarNav from '../../layouts/sidebar-section/sidebar-nav';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/theme/AppThemeProvider';
import { throttle } from '../../utils/performance';

type UiSidebarProps = {
  isMobileOpen?: boolean;
  toggleMobileSidebar?: () => void;
};

const UiSidebar: React.FC<UiSidebarProps> = ({ isMobileOpen, toggleMobileSidebar }) => {
  const [open, setOpen] = useState(true);
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const [expandedSubLink, setExpandedSubLink] = useState<string | null>(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const {
    hasAnyOfPermissions,
    isSuperAdmin,
    isLoading,
    hasCachedData
  } = usePermissionsCheck();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    const throttledOnResize = throttle(onResize, 160);
    onResize();
    window.addEventListener('resize', throttledOnResize);
    return () => window.removeEventListener('resize', throttledOnResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      if (typeof isMobileOpen !== 'undefined') {
        setOpen(Boolean(isMobileOpen));
      } else {
        setOpen(false);
      }
    } else {
      setOpen(true);
    }
  }, [isMobile, isMobileOpen]);

  const filteredModules = useMemo((): FilteredModule[] => {
    if (isLoading && !hasCachedData) {
      return (modules as Module[]).map((module: Module) => ({
        moduleName: module.moduleName,
        permissions: module.permissions,
        links: module.links
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

        if (!moduleAccess) return null;

        const filteredLinks = module.links
          .map((link: SidebarLink): FilteredSidebarLink | null => {
            let linkAccess = false;
            if (isSuperAdmin) linkAccess = true;
            else if (link.permissions.length === 0) linkAccess = true;
            else linkAccess = hasAnyOfPermissions(link.permissions);
            if (!linkAccess) return null;

            let filteredSubLinks: SubLink[] | undefined = undefined;
            if (link.subLinks && link.subLinks.length > 0) {
              filteredSubLinks = link.subLinks
                .map((subLink: SubLink): SubLink | null => {
                  let subLinkAccess = false;
                  if (isSuperAdmin) subLinkAccess = true;
                  else if (subLink.permissions.length === 0) subLinkAccess = true;
                  else subLinkAccess = hasAnyOfPermissions(subLink.permissions);
                  return subLinkAccess ? subLink : null;
                })
                .filter((s): s is SubLink => s !== null);
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
          .filter((l): l is FilteredSidebarLink => l !== null);

        return filteredLinks.length > 0 ? {
          moduleName: module.moduleName,
          permissions: module.permissions,
          links: filteredLinks
        } : null;
      })
      .filter((m): m is FilteredModule => m !== null);

    return result;
  }, [isSuperAdmin, hasAnyOfPermissions, isLoading, hasCachedData]);

  if (isMobile) {
    if (!isMobileOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => { if (toggleMobileSidebar) toggleMobileSidebar(); }}
        />
        <nav
          className={`fixed left-0 top-0 z-50 h-screen border-r transition-[width,transform,background-color,border-color,color] duration-300 ease-in-out flex flex-col ${isDark ? 'border-gray-800 bg-gray-900 text-gray-100 shadow-lg' : 'border-gray-200 bg-white text-gray-900 shadow-lg'
            }`}
          style={{ width: '260px' }}
        >
          <SidebarHeader
            isSidebarExpanded={true}
            isMobile={true}
            toggleMobileSidebar={() => { if (toggleMobileSidebar) toggleMobileSidebar(); }}
            toggleSidebar={() => setOpen((v) => !v)}
          />

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <SidebarNav
              modules={filteredModules}
              isSidebarExpanded={true}
              expandedLink={expandedLink}
              expandedSubLink={expandedSubLink}
              toggleLink={(to: string) => {
                setExpandedLink((prev) => (prev === to ? null : to));
                setExpandedSubLink(null);
              }}
              toggleSubLink={(to: string) => setExpandedSubLink((prev) => (prev === to ? null : to))}
              handleLinkClick={() => { if (toggleMobileSidebar) toggleMobileSidebar(); }}
              currentPath={location.pathname}
            />
          </div>
        </nav>
      </>
    );
  }

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-[width,transform,background-color,border-color,color] duration-300 ease-in-out flex flex-col ${isDark ? 'border-gray-800 bg-gray-900 text-gray-100 shadow-sm' : 'border-gray-200 bg-white text-gray-900 shadow-sm'
        }`}
      style={{ width: open ? '260px' : '72px' }}
    >
      <SidebarHeader
        isSidebarExpanded={open}
        isMobile={false}
        toggleMobileSidebar={() => { }}
        toggleSidebar={() => setOpen((v) => !v)}
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide dark:scrollbar-thumb-gray-700">
        <SidebarNav
          modules={filteredModules}
          isSidebarExpanded={open}
          expandedLink={expandedLink}
          expandedSubLink={expandedSubLink}
          toggleLink={(to: string) => {
            setExpandedLink((prev) => (prev === to ? null : to));
            setExpandedSubLink(null);
          }}
          toggleSubLink={(to: string) => setExpandedSubLink((prev) => (prev === to ? null : to))}
          handleLinkClick={() => { }}
          currentPath={location.pathname}
        />
      </div>
    </nav>
  );
};

export default UiSidebar;