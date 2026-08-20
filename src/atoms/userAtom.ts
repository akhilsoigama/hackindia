import { atom, useAtom } from "jotai";
import useSWR from "swr";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import fetcher, { endpoints } from "../utils/axios";
import { User, ApiResponse, isSuperAdmin, isInstitute, isFacultyUser, isStudent } from "../types/user";
import { clearUserDB, getUserDB, setUserDB } from "../indexDB";

// -----------------------------
// Types
// -----------------------------
interface UseUserReturn {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  isOffline: boolean;
  refreshUser: () => void;

  // Role checking methods
  isSuperAdmin: boolean;
  isInstitute: boolean;
  isFacultyUser: boolean;
  isStudent: boolean;
}


export const userAtom = atom<User | null>(null);

// -----------------------------
// Hook: useUser()
// -----------------------------
export const useUser = (): UseUserReturn => {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(
    endpoints.auth.me,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      errorRetryCount: 1,
      dedupingInterval: 10000,
      focusThrottleInterval: 30000,
    }
  );

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
      setUserDB(data.data);
    }
  }, [data]);


  useEffect(() => {
    const loadUserFromDB = async () => {
      if (user) {
        return;
      }

      try {
        const storedUser = await getUserDB();

        if (storedUser && !user) {
          setUser(storedUser);
        }
      } catch (err) {
        // console.error("❌ Failed to load user from IndexedDB:", err);
      }
    };

    loadUserFromDB();
  }, []);

useEffect(() => {
  if (!data) return;


  if (data.success && data.data) {
    const backend = data.data;

    const newUserData: User = {
      id: backend?.id ,
      email: backend.email || "",
      fullName: backend.fullName || "",
      authType: backend.userType || backend.authType || 'jwt',
      userType: backend.userType || 'student',
      mobile: backend.mobile,
      instituteId: backend.instituteId,
      facultyId: backend.facultyId,
      isEmailVerified: backend.isEmailVerified ?? false,
      isMobileVerified: backend.isMobileVerified ?? false,
      isActive: backend.isActive ?? true,
      institute: backend.institute,
      faculty: backend.faculty,
      createdAt: backend.createdAt,
      updatedAt: backend.updatedAt,
      isSuperAdmin: function () { return this.userType === 'super_admin'; },
      isInstitute: function () { return this.userType === 'institute'; },
      isFacultyUser: function () { return this.userType === 'faculty'; },
      isStudent: function () { return this.userType === 'student'; },
    };

    setUser(prevUser => {
      const isDifferent = !prevUser ||
        prevUser.id !== newUserData.id ||
        prevUser.email !== newUserData.email ||
        prevUser.userType !== newUserData.userType;

      if (isDifferent) {
        setUserDB(newUserData);
        
        return newUserData;
      } else {
        return prevUser;
      }
    });
  }
}, [data, setUser]);


  useEffect(() => {
    if (error && !user) {

      const handleApiError = async () => {
        try {
          const storedUser = await getUserDB();

          if (!storedUser) {
            await clearUserDB();
            setUser(null);
            toast.error("Session expired. Please log in again.");
            navigate(endpoints.auth.signIn, { replace: true });
          }
        } catch (dbError) {
          await clearUserDB();
          setUser(null);
          navigate(endpoints.auth.signIn, { replace: true });
        }
      };

      handleApiError();
    }
  }, [error, user, navigate, setUser]);

  useEffect(() => {
    const handleOnline = () => {
      mutate();
    };

    const handleOffline = () => {
      console.log("🔴 Offline - Using cached data");
      console.log("👤 Current Cached User:", user);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [mutate, user]);

  const logout = async (): Promise<void> => {
    try {

      await clearUserDB();
      setUser(null);
      mutate(undefined, false);
      navigate(endpoints.auth.signIn, { replace: true });
      toast.success("Logged out successfully");

    } catch (err) {
      toast.error("Error during logout");
    }
  };

  const isSuperAdminUser = isSuperAdmin(user);
  const isInstituteUser = isInstitute(user);
  const isFacultyUserType = isFacultyUser(user);
  const isStudentUser = isStudent(user);

  return {
    user,
    setUser: (newUser: User | null) => {
      if (newUser) {
        setUser(newUser);
        setUserDB(newUser);
      } else {
        setUser(null);
        clearUserDB();
      }
    },
    logout,
    isLoading,
    isError: !!error && !user,
    isOffline: !navigator.onLine,
    refreshUser: mutate,

    // Role checking methods
    isSuperAdmin: isSuperAdminUser,
    isInstitute: isInstituteUser,
    isFacultyUser: isFacultyUserType,
    isStudent: isStudentUser,
  };
};


export const useIsAuthenticated = (): boolean => {
  const { user } = useUser();
  const isAuthenticated = !!user;
  return isAuthenticated;
};

// ✅ Get user role/type
export const useUserRole = (): string | undefined => {
  const { user } = useUser();
  const role = user?.userType || user?.authType;
  return role;
};

// ✅ Check specific user roles
export const useIsSuperAdmin = (): boolean => {
  const { user } = useUser();
  const isSuperAdmin = user?.userType === 'super_admin' || user?.authType === 'super_admin';
  return isSuperAdmin;
};

export const useIsInstitute = (): boolean => {
  const { user } = useUser();
  const isInstitute = user?.userType === 'institute' || user?.authType === 'institute';
  return isInstitute;
};

export const useIsFaculty = (): boolean => {
  const { user } = useUser();
  const isFaculty = user?.userType === 'faculty' || user?.authType === 'faculty';
  return isFaculty;
};

export const useIsStudent = (): boolean => {
  const { user } = useUser();
  const isStudent = user?.userType === 'student' || user?.authType === 'student';
  return isStudent;
};

export const useUserPermissions = (): string[] => {
  const { user } = useUser();

  if (!user) {
    return [];
  }

  const basePermissions = ['authenticated'];

  let permissions: string[] = [];

  switch (user.userType) {
    case 'super_admin':
      permissions = [...basePermissions, 'super_admin', 'manage_all'];
      break;
    case 'institute':
      permissions = [...basePermissions, 'institute', 'manage_institute'];
      break;
    case 'faculty':
      permissions = [...basePermissions, 'faculty', 'manage_faculty'];
      break;
    case 'student':
      permissions = [...basePermissions, 'student', 'view_courses'];
      break;
    default:
      permissions = basePermissions;
  }



  return permissions;
};
