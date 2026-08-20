// hooks/RollPermission.ts
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import axiosInstance, { endpoints, fetcher } from "../utils/axios";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { rolePermissionsAtom } from "../atoms/roleAtom";
import { getErrorMessage } from "../utils/errorHandler";
import {
  deleteRolePermissionDB,
  getRolePermissionsDB,
  setRolePermissionDB,
} from "../indexDB/rolePermission";
import { IUserRolePermissionItem, ICreateUserRolePermission, IUpdateUserRolePermission } from "../types/Roles";

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: (error: any) => error?.status !== 401 && error?.status !== 403,
};

export function useGetUserRolePermissions() {
  const [permissions, setPermissions] = useAtom(rolePermissionsAtom);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Online - revalidating data");
      setIsOffline(false);
      setAuthError(false);
      setHasPermissionError(false);
    };
    const handleOffline = () => {
      console.log("📴 Offline - using cached data");
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const shouldFetch = !isOffline && !authError && !hasPermissionError;

  const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: IUserRolePermissionItem[] }>(
    shouldFetch ? endpoints.role.getAll : null,
    async (url: string) => {
      try {
        console.log("🔍 Fetching roles from API...");
        const response = await fetcher(url);
        console.log("✅ Roles fetched successfully:", response);
        return response;
      } catch (err: any) {
        console.error("❌ Roles fetch failed:", err);
        const message = getErrorMessage(err);

        if (err?.status === 401) {
          setAuthError(true);
          toast.error(message);
        } else if (err?.status === 403) {
          setHasPermissionError(true);
          toast.error(message);
        } else if (err?.code === "NETWORK_ERROR" || !navigator.onLine) {
          setIsOffline(true);
          toast.warning("Network error - using offline data");
        }

        throw err;
      }
    },
    swrOptions
  );

  // Load from IndexedDB on mount or when errors occur
  useEffect(() => {
    const loadFromDB = async () => {
      try {
        console.log("💾 Loading roles from IndexedDB...");
        const stored = await getRolePermissionsDB();
        console.log("📁 Stored roles from DB:", stored.length);

        if (stored.length) {
          setPermissions(stored);
          if (isOffline || authError || hasPermissionError) {
            toast.info("Using cached roles data");
          }
        } else if (isOffline || hasPermissionError) {
          toast.warning("No cached roles data available");
        }
      } catch (dbError) {
        console.error("❌ Failed to load roles from DB:", dbError);
      }
    };

    loadFromDB();
  }, [isOffline, authError, hasPermissionError, setPermissions]);

  // Save API data to state and IndexedDB
  useEffect(() => {
    if (data?.data && !authError && !hasPermissionError) {
      console.log("💫 Updating roles from API response...");
      const permsWithId = data.data.map((p) => ({
        ...p,
        id: p.id ?? Date.now() + Math.random(),
      }));

      setPermissions(permsWithId);

      permsWithId.forEach((perm) => {
        setRolePermissionDB(perm).catch((err) =>
          console.error("Failed to save role to DB:", err)
        );
      });

      console.log("✅ Roles updated:", permsWithId.length);
    }
  }, [data, authError, hasPermissionError, setPermissions]);

  // Manual revalidation
  const revalidate = () => {
    setAuthError(false);
    setHasPermissionError(false);
    mutate();
  };

  return useMemo(
    () => ({
      userRolePermissions: permissions,
      isLoading: shouldFetch ? isLoading : false,
      userRolePermissionsError: error,
      userRolePermissionsValidating: isValidating,
      userRolePermissionsEmpty: !isLoading && permissions.length === 0,
      isOffline,
      hasAuthError: authError,
      hasPermissionError,
      hasRolePermissionAccess: !hasPermissionError && !authError,
      revalidate,
    }),
    [permissions, isLoading, error, isValidating, shouldFetch, isOffline, authError, hasPermissionError]
  );
}

// Single permission hook
export function useGetUserRolePermission(permissionId: number) {
  const [permissions] = useAtom(rolePermissionsAtom);
  const [isOffline] = useState(!navigator.onLine);
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [authError, setAuthError] = useState(false);

  const shouldFetch = !isOffline && !authError && !hasPermissionError;
  const url = shouldFetch ? endpoints.role.details(permissionId) : null;

  const { data, isLoading, error, isValidating } = useSWR(
    url,
    async (url: string) => {
      try {
        const response = await fetcher(url);
        return response;
      } catch (err: any) {
        const message = getErrorMessage(err);
        if (err?.status === 401) {
          setAuthError(true);
          toast.error(message);
        } else if (err?.status === 403) {
          setHasPermissionError(true);
          toast.error(message);
        }
        throw err;
      }
    },
    swrOptions
  );

  const permission = useMemo(() => {
    if (data?.data) return data.data;
    return permissions.find((p) => p.id === permissionId) || null;
  }, [data, permissions, permissionId]);

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
    }),
    [permission, isLoading, error, isValidating, isOffline, authError, hasPermissionError]
  );
}

// CRUD functions
export async function createUserRolePermission(permissionData: ICreateUserRolePermission) {
  try {
    console.log("🔄 Creating role permission...", permissionData);
    const res = await axiosInstance.post(endpoints.role.create, permissionData);
    console.log("✅ Create response:", res);

    if (res?.status === 201 || res?.status === 200) {
      const createdRole = res.data?.data || res.data;
      if (createdRole) {
        const roleWithId = {
          ...createdRole,
          id: createdRole.id || `temp-${Date.now()}`,
        };
        await setRolePermissionDB(roleWithId);
        toast.success("User role permission created successfully");
        return roleWithId.id;
      }
    }

    toast.error("Unexpected response from server");
    return null;
  } catch (error: unknown) {
    console.error("❌ Create role error:", error);
    toast.error(getErrorMessage(error));
    return null;
  }
}

export async function updateUserRolePermission(permissionId: number, permissionData: IUpdateUserRolePermission) {
  try {
    console.log("🔄 Updating role permission...", permissionId, permissionData);
    const res = await axiosInstance.put(endpoints.role.update(permissionId), permissionData);

    if (res?.status === 200) {
      const updated = res.data?.data || res.data;
      if (updated) {
        await setRolePermissionDB(updated);
        toast.success("User role permission updated successfully");
        return updated;
      }
    }

    throw new Error("Unexpected response format");
  } catch (error: unknown) {
    console.error("❌ Update role error:", error);
    toast.error(getErrorMessage(error));
    throw error;
  }
}

export async function deleteUserRolePermission(permissionId: number) {
  try {
    console.log("🗑️ Deleting role permission...", permissionId);
    const res = await axiosInstance.delete(endpoints.role.delete(permissionId));

    if (res?.status === 200) {
      await deleteRolePermissionDB(permissionId);
      toast.success("User role permission deleted successfully");
      return res.data;
    }

    throw new Error("Unexpected response format");
  } catch (error: unknown) {
    console.error("❌ Delete role error:", error);
    toast.error(getErrorMessage(error));
    throw error;
  }
}