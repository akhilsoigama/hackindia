import { useEffect, useMemo, useState, useCallback } from "react";
import { useSetAtom } from "jotai";
import { PermissionAtom } from "../atoms/permission";
import { usePermissions } from "../action/permission";
import { Permission, PermissionsResponse } from "../types/Permissions";
import { PermissionKeys, PermissionModules } from "../utils/permission";
import {
  useBuildPermissionEntities as buildPermissionEntities,
  useEnsureCommunicationPermissions as ensureCommunicationPermissions,
} from "./usePermissionEntityBuilder";

export type PermissionEntity = {
  name: string;
  keys: {
    create?: number | number[];
    view?: number | number[];
    update?: number;
    delete?: number;
    access?: number;
    [key: string]: number | number[] | undefined;
  };
};

export const useOptimizedPermissions = () => {
  const { permissions, isLoading, isError, error } = usePermissions();
  const [cachedPermissions, setCachedPermissions] = useState<Permission[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("permissions_cache");
        return saved ? (JSON.parse(saved) as Permission[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const setPermissionAtom = useSetAtom(PermissionAtom);

  // ✅ Move these inside the hook
  const MODULE_KEYS_MAP = useMemo(() => {
    const map = new Map<string, string>();
    Object.entries(PermissionModules).forEach(([moduleKey, module]) => {
      // Handle both readonly and mutable arrays
      const permissionKeys = Array.isArray(module.permissions)
        ? module.permissions
        : Array.from(module.permissions);

      (permissionKeys as string[]).forEach(permissionKey => {
        map.set(permissionKey, moduleKey);
      });
    });
    return map;
  }, []);

  const formatPermissionName = useCallback((key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, []);

  const normalizedPermissions: Permission[] = useMemo(() => {
    if (!permissions) return [];

    if (Array.isArray(permissions)) {
      return permissions;
    }

    return (permissions as unknown as PermissionsResponse)?.data ?? [];
  }, [permissions]);

  useEffect(() => {
    if (normalizedPermissions.length > 0) {
      localStorage.setItem("permissions_cache", JSON.stringify(normalizedPermissions));
      setCachedPermissions(normalizedPermissions);
      setPermissionAtom(normalizedPermissions);
    }
  }, [normalizedPermissions, setPermissionAtom]);

  const safePermissions = useMemo(() => {
    return normalizedPermissions.length > 0 ? normalizedPermissions : cachedPermissions;
  }, [normalizedPermissions, cachedPermissions]);

  const permissionMatrix: PermissionEntity[] = useMemo(() => {
    if (safePermissions.length === 0) return [];

    const moduleGroups: Record<string, {
      moduleName: string;
      permissions: Array<{ id: number; key: string; name: string }>;
      hasAccess: boolean;
    }> = {};

    // Initialize module groups
    Object.entries(PermissionModules).forEach(([moduleKey, module]) => {
      moduleGroups[moduleKey] = {
        moduleName: module.name,
        permissions: [],
        hasAccess: false,
      };
    });

    // Group permissions
    safePermissions.forEach((perm) => {
      const key = perm.permissionKey ?? "";
      const id = perm.id;
      if (!key || !id) return;

      const moduleKey = MODULE_KEYS_MAP.get(key);

      if (moduleKey && moduleGroups[moduleKey]) {
        moduleGroups[moduleKey].permissions.push({
          id,
          key,
          name: formatPermissionName(key),
        });
        moduleGroups[moduleKey].hasAccess = true;
      } else {
        if (!moduleGroups.OTHER) {
          moduleGroups.OTHER = {
            moduleName: "Other",
            permissions: [],
            hasAccess: false,
          };
        }
        moduleGroups.OTHER.permissions.push({
          id,
          key,
          name: formatPermissionName(key),
        });
        moduleGroups.OTHER.hasAccess = true;
      }
    });

    // Filter empty modules
    const nonEmptyModules = Object.entries(moduleGroups)
      .filter(([, group]) => group.permissions.length > 0);

    if (nonEmptyModules.length === 0) return [];

    const filteredModuleGroups = Object.fromEntries(nonEmptyModules);

    // Check if these are custom hooks - if they are, they need to be called at the top level
    const result = buildPermissionEntities(filteredModuleGroups);
    const finalResult = ensureCommunicationPermissions(result, safePermissions);

    return finalResult;
  }, [safePermissions, MODULE_KEYS_MAP, formatPermissionName]);

  const hasModuleAccess = useCallback((moduleKey: keyof typeof PermissionModules) => {
    const module = PermissionModules[moduleKey];
    if (!module) return false;

    const permissionKeys = Array.isArray(module.permissions)
      ? module.permissions
      : Array.from(module.permissions);

    return (permissionKeys as string[]).some(permissionKey =>
      safePermissions.some(perm => perm.permissionKey === permissionKey)
    );
  }, [safePermissions]);

  const getModulePermissions = useCallback((moduleKey: keyof typeof PermissionModules) => {
    const module = PermissionModules[moduleKey];
    if (!module) return [];

    const permissionKeys = Array.isArray(module.permissions)
      ? module.permissions
      : Array.from(module.permissions);

    return safePermissions.filter(perm =>
      (permissionKeys as string[]).includes(perm.permissionKey ?? "")
    );
  }, [safePermissions]);

  const hasPermission = useCallback((permissionKey: PermissionKeys) => {
    return safePermissions.some(perm => perm.permissionKey === permissionKey);
  }, [safePermissions]);

  const allModules = useMemo(() => {
    return Object.entries(PermissionModules).map(([key, module]) => ({
      key: key as keyof typeof PermissionModules,
      name: module.name,
      permissions: module.permissions,
    }));
  }, []);

  return {
    permissions: safePermissions,
    permissionMatrix,
    isLoading: isLoading && safePermissions.length === 0,
    isError,
    error,
    hasModuleAccess,
    getModulePermissions,
    hasPermission,
    allModules,
  };
};