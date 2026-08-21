// src/lib/auth.ts
import { useAtomValue, useSetAtom } from "jotai";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api, { fetcher, endpoints } from "../utils/axios";
import { User, UserData as AppUserData, isSuperAdmin, isInstitute, isFacultyUser, isStudent } from "../types/user";
import { clearUserDB, getUserDB, setUserDB } from "../indexDB";
import {
  userAtom,
  userIdAtom,
  isAuthenticatedAtom,
  userPermissionsAtom,
} from "../store/atoms/user.atoms";
export { userAtom, userIdAtom, isAuthenticatedAtom, userPermissionsAtom };

export const useUser = () => {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldFetchProfile = !location.pathname.startsWith('/login');
  const [isHydratingUser, setIsHydratingUser] = useState(true);

  type ProfileResponse = { data?: AppUserData | User } | AppUserData | User;

  const { data, error, isLoading, mutate } = useSWR<ProfileResponse>(
    shouldFetchProfile ? endpoints.auth.me : null,
    fetcher,
    {
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    onErrorRetry: (error, _key, _config, revalidate, context) => {
      const status = (error as { response?: { status?: number } })?.response?.status;

      if (status === 401) {
        return;
      }

      if (context.retryCount >= 2) {
        return;
      }

      setTimeout(() => {
        revalidate({ retryCount: context.retryCount + 1 });
      }, 1500);
    },
  });

  useEffect(() => {
    let isMounted = true;

    if (user) {
      setIsHydratingUser(false);
      return () => {
        isMounted = false;
      };
    }

    getUserDB()
      .then((saved) => {
        if (!isMounted) return;

        if (saved) {
          setUser(saved);
        }

        setIsHydratingUser(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsHydratingUser(false);
      });

    return () => {
      isMounted = false;
    };
  }, [setUser, user]);

  useEffect(() => {
    if (!data) return;

    const rawUser: AppUserData =
      typeof data === "object" && data !== null && "data" in data && data.data
        ? (data.data as AppUserData)
        : (data as AppUserData);

    const normalizedPermissions = Array.isArray(rawUser.permissions)
      ? rawUser.permissions
      : rawUser.permissions && typeof rawUser.permissions === "object"
        ? Object.entries(rawUser.permissions)
            .filter(([, isAllowed]) => Boolean(isAllowed))
            .map(([permissionKey]) => permissionKey)
        : undefined;

    if (!rawUser?.id && !rawUser?.fullName) return;

    const toNumberOrNull = (value: unknown): number | null | undefined => {
      if (value === null) return null;
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
        return Number(value);
      }
      return undefined;
    };

    const rawUserRecord = rawUser as unknown as Record<string, unknown>;
    const normalizedInstituteId = toNumberOrNull(rawUser.instituteId ?? rawUserRecord.institute_id);
    const normalizedFacultyId = toNumberOrNull(rawUser.facultyId ?? rawUserRecord.faculty_id);
    const normalizedDepartmentId = toNumberOrNull(rawUser.departmentId ?? rawUserRecord.department_id);

    const finalUser: User = {
      id: rawUser.id,
      email: rawUser.email || "",
      fullName: rawUser.fullName || "User",
      userType: rawUser.userType || "student",
      authType: rawUser.authType || rawUser.userType || "jwt",
      mobile: rawUser.mobile,
      instituteId: normalizedInstituteId ?? rawUser.instituteId,
      facultyId: normalizedFacultyId ?? rawUser.facultyId,
      departmentId: normalizedDepartmentId ?? rawUser.departmentId,
      isEmailVerified: rawUser.isEmailVerified ?? false,
      isMobileVerified: rawUser.isMobileVerified ?? false,
      isActive: rawUser.isActive ?? true,
      institute: rawUser.institute,
      faculty: rawUser.faculty,
      createdAt: typeof rawUser.createdAt === "string" ? rawUser.createdAt : undefined,
      updatedAt: typeof rawUser.updatedAt === "string" ? rawUser.updatedAt : undefined,
      roles: rawUser.roles,
      permissions: normalizedPermissions,
      roleName: rawUser.roleName,

      data: rawUser,
    };

    setUser(finalUser);
    setUserDB(finalUser);
  }, [data, setUser]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const status = (error as { response?: { status?: number } })?.response?.status;

    if (status === 401) {
      clearUserDB();
      localStorage.removeItem('cachedUserData');
      localStorage.removeItem('lms:user');
      setUser(null);

      if (!location.pathname.startsWith('/login')) {
        toast.error("Session expired. Redirecting to login...");
        navigate("/login", { replace: true });
      }
    }
  }, [error, setUser, navigate, location.pathname]);

  const logout = async () => {
    try {
      await api.post(endpoints.auth.logout);
    } catch {
      // Ignore network errors and continue local logout cleanup.
    }

    await clearUserDB();
    localStorage.removeItem('cachedUserData');
    localStorage.removeItem('lms:user');
    localStorage.removeItem('lms:authToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    setUser(null);
    mutate(undefined, false);
    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  };

  return {
    user,
    setUser,
    logout,
    isLoading: (isLoading || isHydratingUser) && !user,
    isError: !!error,
    refreshUser: mutate,

    isSuperAdmin: isSuperAdmin(user),
    isInstitute: isInstitute(user),
    isFacultyUser: isFacultyUser(user),
    isStudent: isStudent(user),
  };
};