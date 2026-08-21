import useSWR, { mutate } from "swr";
import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance, { endpoints, fetcher } from "../utils/axios";
import { toast } from "sonner";
import { useAtom, useAtomValue } from "jotai";
import { rolePermissionsAtom } from "../atoms/roleAtom";
import { getErrorMessage } from "../utils/errorHandler";
import {
  deleteRolePermissionDB,
  getRolePermissionsDB,
  setRolePermissionDB,
  clearRolePermissionsDB,
} from "../indexDB/rolePermission";
import {
  IUserRolePermissionItem,
  ICreateUserRolePermission,
  IUpdateUserRolePermission,
} from "../types/Roles";

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: (error: unknown) => {
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status?: number }).status
        : undefined;
    return status !== 401 && status !== 403;
  },
};

export function useGetUserRolePermissions() {
  const [permissions, setPermissions] = useAtom(rolePermissionsAtom);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setAuthError(false);
      setHasPermissionError(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const shouldFetch = !isOffline && !authError && !hasPermissionError;

  const { data, isLoading, error, isValidating, mutate } = useSWR<{
    data: IUserRolePermissionItem[];
  }>(
    shouldFetch ? endpoints.role.getAll : null,
    async (url: string) => {
      try {
        const response = await fetcher<{ data: IUserRolePermissionItem[] }>(url);
        setLastSyncTime(Date.now());
        return response;
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        const status =
          typeof err === 'object' && err !== null && 'status' in err
            ? (err as { status?: number }).status
            : undefined;

        if (status === 401) {
          setAuthError(true);
          toast.error(message);
        } else if (status === 403) {
          setHasPermissionError(true);
          toast.error(message);
        } else if (
          (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === "NETWORK_ERROR") ||
          !navigator.onLine
        ) {
          setIsOffline(true);
          toast.warning("Network error - using offline data");
        }
        throw err;
      }
    },
    {
      ...swrOptions,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 60000,
      dedupingInterval: 300000,
      focusThrottleInterval: 300000,
    },
  );

  useEffect(() => {
    const loadFromDB = async () => {
      try {
        if (permissions.length !== 0) return;
        const stored = await getRolePermissionsDB();
        if (stored.length > 0) {
          setPermissions(stored);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to load role permissions from IndexedDB", error);
        }
      }
    };

    loadFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.data && !authError && !hasPermissionError) {
      const freshPermissions = data.data.map((p) => ({
        ...p,
        _syncedAt: Date.now(),
      }));

      setPermissions(freshPermissions);

      const storeFreshData = async () => {
        try {
          await clearRolePermissionsDB();
          for (const perm of freshPermissions) {
            await setRolePermissionDB(perm);
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Failed to persist role permissions to IndexedDB", error);
          }
        }
      };

      storeFreshData();
    }
  }, [data, authError, hasPermissionError, setPermissions]);

  const revalidate = useCallback(async () => {
    setAuthError(false);
    setHasPermissionError(false);
    await mutate();
  }, [mutate]);

  return useMemo(
    () => ({
      userRolePermissions: permissions,
      isLoading,
      userRolePermissionsError: error,
      userRolePermissionsValidating: isValidating,
      userRolePermissionsEmpty: !isLoading && permissions.length === 0,
      isOffline,
      hasAuthError: authError,
      hasPermissionError,
      hasRolePermissionAccess: !hasPermissionError && !authError,
      lastSyncTime,
      revalidate,
    }),
    [
      permissions,
      isLoading,
      error,
      isValidating,
      isOffline,
      authError,
      hasPermissionError,
      lastSyncTime,
      revalidate,
    ],
  );
}

export function useGetUserRolePermission(permissionId: number) {
  const permissions = useAtomValue(rolePermissionsAtom);
  const [isOffline] = useState(!navigator.onLine);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [localPermission, setLocalPermission] =
    useState<IUserRolePermissionItem | null>(null);

  const shouldFetch = !isOffline && !authError && !hasPermissionError;
  const url =
    shouldFetch && permissionId ? endpoints.role.details(permissionId) : null;

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    async (url: string) => {
      try {
        const response = await fetcher<{ data: IUserRolePermissionItem }>(url);
        if (response.data) {
          const freshPermission = {
            ...response.data,
            _syncedAt: Date.now(),
          };
          await setRolePermissionDB(freshPermission);
          setLocalPermission(freshPermission);
        }
        return response;
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        const status =
          typeof err === 'object' && err !== null && 'status' in err
            ? (err as { status?: number }).status
            : undefined;
        if (status === 401) {
          setAuthError(true);
          toast.error(message);
        } else if (status === 403) {
          setHasPermissionError(true);
          toast.error(message);
        }
        throw err;
      }
    },
    {
      ...swrOptions,
      revalidateOnMount: true,
      dedupingInterval: 300000,
      focusThrottleInterval: 300000,
      revalidateIfStale: true,
    },
  );

  const permission = useMemo(() => {
    if (data?.data) return data.data;
    if (localPermission) return localPermission;
    return permissions.find((p) => p.id === permissionId) || null;
  }, [data, localPermission, permissions, permissionId]);

  return useMemo(
    () => ({
      userRolePermission: permission,
      isLoading,
      userRolePermissionError: error,
      userRolePermissionValidating: isValidating,
      userRolePermissionEmpty: !permission && !isLoading && !error,
      isOffline,
      hasAuthError: authError,
      hasPermissionError,
      hasRolePermissionAccess: !hasPermissionError && !authError,
      mutate,
    }),
    [
      permission,
      isLoading,
      error,
      isValidating,
      isOffline,
      authError,
      hasPermissionError,
    ],
  );
}

export async function createUserRolePermission(
  permissionData: ICreateUserRolePermission,
) {
  try {
    const res = await axiosInstance.post(endpoints.role.create, permissionData);

    if (res?.status === 201 || res?.status === 200) {
      const responseData = res.data?.data || res.data;

      if (responseData) {
        const createdRole: IUserRolePermissionItem = {
          id: responseData.id || responseData.role?.id,
          roleName: responseData.roleName || responseData.role?.roleName,
          roleKey: responseData.roleKey || responseData.role?.roleKey,
          roleDescription:
            responseData.roleDescription || responseData.role?.roleDescription,
          isDefault:
            responseData.isDefault || responseData.role?.isDefault || false,
          permissions: responseData.permissions || [],
          createdAt: responseData.createdAt || responseData.role?.createdAt,
          updatedAt: responseData.updatedAt || responseData.role?.updatedAt,
          _syncedAt: Date.now(),
        };

        await setRolePermissionDB(createdRole);
        await mutate(endpoints.role.getAll);
        return createdRole.id;
      }
    }
    toast.error("Unexpected response from server");
    return null;
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
    return null;
  }
}

export async function updateUserRolePermission(
  permissionId: number,
  permissionData: IUpdateUserRolePermission,
) {
  try {
    const res = await axiosInstance.put(
      endpoints.role.update(permissionId),
      permissionData,
    );

    if (res?.status === 200) {
      const responseData = res.data?.data || res.data;

      if (responseData) {
        const updatedRole: IUserRolePermissionItem = {
          id: responseData.id || responseData.role?.id || permissionId,
          roleName: responseData.roleName || responseData.role?.roleName,
          roleKey: responseData.roleKey || responseData.role?.roleKey,
          roleDescription:
            responseData.roleDescription || responseData.role?.roleDescription,
          isDefault:
            responseData.isDefault || responseData.role?.isDefault || false,
          permissions: responseData.permissions || [],
          createdAt: responseData.createdAt || responseData.role?.createdAt,
          updatedAt: responseData.updatedAt || responseData.role?.updatedAt,
          _syncedAt: Date.now(),
        };

        await setRolePermissionDB(updatedRole);

        await Promise.all([
          mutate(endpoints.role.details(permissionId)),
          mutate(endpoints.role.getAll),
        ]);

        return updatedRole;
      }
    }

    throw new Error("Unexpected response format");
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
    throw error;
  }
}

export async function deleteUserRolePermission(
  permissionId: number,
) {
  try {
    const res = await axiosInstance.delete(
      endpoints.role.delete(permissionId),
    );

    if (res?.status === 200 || res?.status === 204) {
      await deleteRolePermissionDB(permissionId);

      await mutate(
        endpoints.role.getAll,
        (currentData: { data?: IUserRolePermissionItem[] } | undefined) => {
          if (!currentData?.data) return currentData;

          return {
            ...currentData,
            data: currentData.data.filter(
              (p: IUserRolePermissionItem) =>
                p.id !== permissionId,
            ),
          };
        },
        false,
      );

      toast.success("User role permission deleted successfully");

      return res.data;
    }

    throw new Error("Unexpected response format");
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
    throw error;
  }
}

export function useRolesDataFreshness() {
  const permissions = useAtomValue(rolePermissionsAtom);

  return useMemo(() => {
    if (permissions.length === 0) return { isFresh: false, lastUpdate: null };

    const latestSync = Math.max(...permissions.map((p) => p._syncedAt || 0));
    const isFresh = Date.now() - latestSync < 300000;

    return {
      isFresh,
      lastUpdate: latestSync > 0 ? new Date(latestSync) : null,
      totalRoles: permissions.length,
    };
  }, [permissions]);
}
