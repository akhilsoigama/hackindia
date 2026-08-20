// types/user.ts
export interface User {
  id?: number;
  email?: string;
  fullName?: string;
  authType?: 'super_admin' | 'institute' | 'faculty' | 'student' | 'admin' | 'jwt';
  userType?: 'super_admin' | 'institute' | 'faculty' | 'student';
  mobile?: string;
  instituteId?: number | null;
  facultyId?: number | null;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  isActive?: boolean;
  institute?: any;
  faculty?: any;
  createdAt?: string;
  updatedAt?: string;
  data?: any;
  
  // Permissions from backend
  roles?: string[];
  permissions?: string[];
  roleName?: string;
  
  // Helper methods
  isSuperAdmin?: () => boolean;
  isInstitute?: () => boolean;
  isFacultyUser?: () => boolean;
  isStudent?: () => boolean;
}

export interface ApiResponse {
  success: boolean;
  authType?: string;
  data?: User | null;
  id: number;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Type guards
export const isSuperAdmin = (user: User | null): boolean => {
  return user?.userType === 'super_admin' || user?.authType === 'super_admin';
};

export const isInstitute = (user: User | null): boolean => {
  return user?.userType === 'institute' || user?.authType === 'institute';
};

export const isFacultyUser = (user: User | null): boolean => {
  return user?.userType === 'faculty' || user?.authType === 'faculty';
};

export const isStudent = (user: User | null): boolean => {
  return user?.userType === 'student' || user?.authType === 'student';
};

export type UserRole = 'super_admin' | 'institute' | 'faculty' | 'student' | 'admin' | 'jwt';