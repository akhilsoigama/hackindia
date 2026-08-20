// hooks/useOptimizedPermissions.ts
import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { PermissionAtom } from '../atoms/permission';
import { usePermissions } from '../action/permission';
import { Permission, PermissionsResponse } from '../types/Permissions';

export const useOptimizedPermissions = () => {
  const { permissions, isLoading, isError, error } = usePermissions();

  const [cachedPermissions, setCachedPermissions] = useState<Permission[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('permissions_cache');
      try {
        const parsed = JSON.parse(saved || '[]');
        return Array.isArray(parsed) ? (parsed as Permission[]) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [, setPermissionAtom] = useAtom(PermissionAtom);

  // ✅ Normalize permissions shape from hook response
  const normalizedPermissions: Permission[] = Array.isArray(permissions)
    ? permissions
    : (permissions as unknown as PermissionsResponse)?.data ?? [];

  useEffect(() => {
    if (normalizedPermissions.length > 0) {
      localStorage.setItem('permissions_cache', JSON.stringify(normalizedPermissions));
      setCachedPermissions(normalizedPermissions);
      setPermissionAtom(normalizedPermissions);
    }
  }, [normalizedPermissions, setPermissionAtom]);

  const activePermissions =
    normalizedPermissions.length > 0 ? normalizedPermissions : cachedPermissions;

  const safePermissions: Permission[] = Array.isArray(activePermissions)
    ? activePermissions
    : [];

  const permissionMatrix = useMemo(() => {
    if (safePermissions.length === 0) return [];

    const grouped: Record<string, any> = {};

    for (const perm of safePermissions) {
      const key = perm.permissionKey ?? '';
      const id = perm.id;

      if (!key || !id) continue;

      const [entityRaw, actionRaw] = key.split('_');
      const entity = entityRaw?.toLowerCase();
      const action = actionRaw?.toLowerCase();

      if (!entity || !action) continue;

      if (!grouped[entity]) {
        grouped[entity] = {
          name: entity.toUpperCase(),
          keys: { create: 0, view: 0, update: 0, delete: 0 },
        };
      }

      const normalizedAction = action === 'read' ? 'view' : action;
      if (normalizedAction in grouped[entity].keys) {
        grouped[entity].keys[normalizedAction] = id;
      }
    }

    return Object.values(grouped).filter((entity: any) =>
      Object.values(entity.keys).some((id) => id !== 0)
    );
  }, [safePermissions]);

  return {
    permissions: safePermissions,
    permissionMatrix,
    isLoading: isLoading && safePermissions.length === 0,
    isError,
    error,
  };
};
