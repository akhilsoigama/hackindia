import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { useAtom } from "jotai";
import { toast } from "sonner";

import axiosInstance, { endpoints } from "../utils/axios";
import { getPermissionsDB, setPermissionDB } from "../indexDB/permission";
import { PermissionAtom } from "../atoms/permission";
import { Permission, PermissionsResponse } from "../types/Permissions";

// -----------------------------
// API Fetcher
// -----------------------------
const fetcher = async (url: string) => {
  try {
    const res = await axiosInstance.get<PermissionsResponse>(url);
    return res.data;
  } catch (error: any) {
    console.error("❌ My Permissions fetch error:", error.response?.data);

    if (error.response?.status === 403) {
      throw new Error("FORBIDDEN: You do not have permission to view permissions");
    }
    if (error.response?.status === 401) {
      throw new Error("UNAUTHORIZED: Please login again");
    }
    throw error;
  }
};

// -----------------------------
// Hook Definition
// -----------------------------
// action/permission.ts - Add detailed debugging
export const usePermissions = () => {
  const [permissions, setPermissions] = useAtom(PermissionAtom);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasPermissionError, setHasPermissionError] = useState(false);


  // 🌐 Track online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 🚫 Only fetch if online and allowed
  const shouldFetch = !isOffline && !hasPermissionError;

  const { data, error, isValidating, mutate } = useSWR<PermissionsResponse>(
    shouldFetch ? endpoints.permission.getAll : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: (error: any) => {
        return !error?.message?.includes("FORBIDDEN") && !error?.message?.includes("UNAUTHORIZED");
      },
    }
  );

  // -----------------------------
  // Handle API Errors
  // -----------------------------
  useEffect(() => {
    if (error) {

      if (error.message.includes("FORBIDDEN")) {
        setHasPermissionError(true);
        toast.error("You don't have permission to view permissions.");
      } else if (error.message.includes("UNAUTHORIZED")) {
        toast.error("Please login again to view permissions.");
      } else {
        toast.error("Failed to load permissions.");
      }
    }
  }, [error]);

  // -----------------------------
  // Load from IndexedDB when offline or forbidden
  // -----------------------------
  useEffect(() => {
    const loadPermissionsFromDB = async () => {
      try {
        const stored = await getPermissionsDB();
        if (stored?.length) {
          setPermissions(stored);
          if (isOffline || hasPermissionError) {
            toast.info("Using cached permissions data");
          }
        }
      } catch (dbError) {
        console.error("❌ Failed to load permissions from DB:", dbError);
      }
    };

    if (isOffline || hasPermissionError || error) {
      loadPermissionsFromDB();
    }
  }, [isOffline, hasPermissionError, error, setPermissions]);

  // -----------------------------
  // Store new permissions in IndexedDB
  // -----------------------------
  useEffect(() => {
    if (data?.data?.length && !isOffline && !hasPermissionError) {
      
      const permissionObjects: Permission[] = data.data.map((perm) => ({
        id: perm.id,
        permissionKey: perm.permissionKey,
        permissionName:
          perm.permissionName ||
          perm.permissionKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        createdAt: perm.createdAt || new Date().toISOString(),
        updatedAt: perm.updatedAt || new Date().toISOString(),
      }));

      setPermissions(permissionObjects);

      try {
        permissionObjects.forEach(setPermissionDB);
      } catch (dbError) {
        console.error("❌ Failed to store permissions in DB:", dbError);
      }
    }
  }, [data, isOffline, hasPermissionError, setPermissions]);

  // -----------------------------
  // Memoized Return Value
  // -----------------------------
  const memoizedValue = useMemo(
    () => ({
      permissions,
      isOffline,
      isLoading: shouldFetch && !data && !error,
      isError: !!error,
      isValidating,
      mutate,
      error: error?.message,
      hasPermissionAccess: !hasPermissionError,

      hasPermission: (permissionKey: string) => {
        return permissions.some((p) => p.permissionKey === permissionKey);
      },
    }),
    [permissions, isOffline, shouldFetch, data, error, isValidating, mutate, hasPermissionError]
  );
  return memoizedValue;
};
