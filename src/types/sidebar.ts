// types/sidebar.ts
import { ReactNode } from 'react';
import { PermissionKeys } from '../utils/permission';

export interface SubLink {
  to: string;
  label: string;
  icon: ReactNode;
  permissions: (PermissionKeys | string)[];
}

export interface SidebarLink {
  to: string;
  label: string;
  icon: ReactNode;
  permissions: (PermissionKeys | string)[];
  subLinks?: SubLink[]; // subLinks is optional
}
export interface LinkItem {
  label: string;
  path: string;
  subLinks?: LinkItem[];
}
export interface Module {
  moduleName: string;
  permissions: (PermissionKeys | string)[];
  links: SidebarLink[];
}

// Helper types for filtered data
export interface FilteredSidebarLink extends Omit<SidebarLink, 'subLinks'> {
  subLinks?: SubLink[]; // Still optional in filtered version
}

export interface FilteredModule extends Omit<Module, 'links'> {
  links: FilteredSidebarLink[];
}