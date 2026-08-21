// types/user.ts
export type UserAuthType = 'super_admin' | 'institute' | 'faculty' | 'student' | 'admin' | 'jwt';
export type UserType = 'super_admin' | 'institute' | 'faculty' | 'student';

export interface UserInstituteData {
  instituteName?: string;
  instituteCode?: string;
  establishedYear?: string | number;
  instituteEmail?: string;
  institutePhone?: string;
  instituteAddress?: string;
  affiliation?: string;
  instituteWebsite?: string;
  [key: string]: unknown;
}

export interface UserFacultyData {
  facultyName?: string;
  facultyCode?: string;
  facultyEmail?: string;
  facultyPhone?: string;
  facultyDescription?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface UserData {
  id?: number;
  fullName?: string;
  authType?: UserAuthType;
  userType?: UserType;
  roleName?: string;
  roles?: string[];
  permissions?: string[] | Record<string, boolean>;
  instituteId?: number | null;
  facultyId?: number | null;
  departmentId?: number | null;
  email?: string;
  mobile?: string;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  isActive?: boolean;
  institute?: UserInstituteData | null;
  faculty?: UserFacultyData | null;
  [key: string]: unknown;
}

export interface User {
  id?: number;
  email?: string;
  fullName?: string;
  authType?: UserAuthType;
  userType?: UserType;
  mobile?: string;
  instituteId?: number | null;
  facultyId?: number | null;
  departmentId?: number | null;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  isActive?: boolean;
  institute?: UserInstituteData | null;
  faculty?: UserFacultyData | null;
  createdAt?: string;
  updatedAt?: string;
  data?: UserData;
  
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
  data?: UserData | User | null;
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

export type UserRole = UserAuthType;