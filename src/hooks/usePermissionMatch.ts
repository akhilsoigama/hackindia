import { useMemo, useState, useEffect } from 'react';
import { useUser } from '../atoms/userAtom';
import { PermissionKeys } from '../utils/permission';

type CachedUserData = {
  roles?: string[];
  roleName?: string;
  permissions?: string[] | Record<string, boolean>;
};

export const usePermissionsCheck = () => {
  const { user } = useUser();
  const [cachedUserData, setCachedUserData] = useState<CachedUserData | null>(null);

  // Clear old cached data first
  useEffect(() => {
    const clearOldCache = () => {
      const cached = localStorage.getItem('cachedUserData');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.roles && parsed.roles.length > 5) {
            localStorage.removeItem('cachedUserData');
            setCachedUserData(null);
          }
        } catch {
          localStorage.removeItem('cachedUserData');
        }
      }
    };
    clearOldCache();
  }, []);

  useEffect(() => {
    if (user?.data) {
      if (user.data.roles && Array.isArray(user.data.roles)) {
        setCachedUserData(user.data);
        localStorage.setItem('cachedUserData', JSON.stringify(user.data));
      }
    }
  }, [user?.data]);

  useEffect(() => {
    const cached = localStorage.getItem('cachedUserData');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.roles && parsed.roles.length <= 10) {
          setCachedUserData(parsed);
        } else {
          localStorage.removeItem('cachedUserData');
        }
      } catch {
        localStorage.removeItem('cachedUserData');
      }
    }
  }, []);

  // Use current user data or fallback to cached data
  const effectiveUserData = user?.data || cachedUserData;

  // Ensure we get ALL permissions including role-based ones
  const userDirectPermissions = useMemo(() => {
    const rawPermissions = effectiveUserData?.permissions;

    if (Array.isArray(rawPermissions)) {
      return rawPermissions;
    }

    if (rawPermissions && typeof rawPermissions === 'object') {
      const permissionMap = rawPermissions as Record<string, boolean>;
      return Object.keys(permissionMap).filter((key) => permissionMap[key] === true);
    }

    return [];
  }, [effectiveUserData?.permissions]);

  const userRoles = useMemo(() => {
    const roles = effectiveUserData?.roles || [];
    const uniqueRoles = Array.from(new Set(roles)).filter(
      role => role && typeof role === 'string' && role.trim() !== ''
    );
    return uniqueRoles;
  }, [effectiveUserData?.roles]);

  const userRoleName = useMemo(() => {
    return effectiveUserData?.roleName || '';
  }, [effectiveUserData?.roleName]);

  const hasAnyOfPermissions = useMemo(() => {
    return (requiredPermissions: (PermissionKeys | string)[]) => {
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }

      if (userRoles.includes('super_admin') || userDirectPermissions.includes('*')) {
        return true;
      }

      return requiredPermissions.some(permission =>
        userDirectPermissions.includes(permission)
      );
    };
  }, [userDirectPermissions, userRoles]);

  const hasAllPermissions = useMemo(() => {
    return (requiredPermissions: (PermissionKeys | string)[]) => {
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }

      if (userRoles.includes('super_admin') || userDirectPermissions.includes('*')) {
        return true;
      }

      return requiredPermissions.every(permission =>
        userDirectPermissions.includes(permission)
      );
    };
  }, [userDirectPermissions, userRoles]);

  const hasRole = useMemo(() => {
    return (requiredRoles: string[]) => {
      if (!requiredRoles || requiredRoles.length === 0) return true;
      return requiredRoles.some(role => userRoles.includes(role));
    };
  }, [userRoles]);

  const isSuperAdmin = useMemo(() => {
    return userRoles.includes('super_admin') || userDirectPermissions.includes('*');
  }, [userRoles, userDirectPermissions]);

  const isInstitute = useMemo(() => {
    return userRoles.includes('institute_admin') || userRoleName === 'Institute Admin';
  }, [userRoles, userRoleName]);

  const isFaculty = useMemo(() => {
    return userRoles.includes('faculty') || userRoleName === 'Faculty';
  }, [userRoles, userRoleName]);

  const isStudent = useMemo(() => {
    return userRoles.includes('student') || userRoleName === 'Student';
  }, [userRoles, userRoleName]);

  const isLoading = !user?.data && !cachedUserData;

  return {
    hasAnyOfPermissions,
    hasAllPermissions,
    hasRole,
    isSuperAdmin,
    isInstitute,
    isFaculty,
    isStudent,
    userPermissionKeys: userDirectPermissions,
    userRoles,
    userRoleName,
    isLoading,
    isError: false,
    hasCachedData: !!cachedUserData
  };
};
