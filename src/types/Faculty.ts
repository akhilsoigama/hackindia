import { IInstitute } from "./Institute";
import { IDepartment } from "./department";
import { IUserRolePermissionItem } from "./Roles";


export type IfacultyItem = {
  id: number;
  facultyName: string;
  facultyId: string;
  designation: string;
  qualification?: string;
  experience?: number;
  facultyEmail: string;
  facultyMobile: string;
  departmentId: number;
  instituteId: number;
  roleId: number;
  isActive: boolean;
  createdAt: string;
  createdBy?: number;
  created_by?: number;
  updatedBy?: number;
  updated_by?: number;

  // Nested objects
  department: IDepartment;
  institute: IInstitute;
  role: IUserRolePermissionItem;
}

export type IcreateFaculty = {
  facultyName: string;
  facultyId?: string;
  designation: string;
  qualification?: string;
  experience?: number;
  facultyEmail: string;
  facultyMobile: string;
  departmentId: number;
  instituteId: number;
  roleId?: number;
  isActive: boolean;
}

export type IupdateFaculty = {
  id: number;
  facultyName: string;
  facultyId: string;
  designation: string;
  qualification?: string;
  experience?: number;
  facultyEmail: string;
  facultyMobile: string;
  departmentId: number;
  instituteId: number;
  roleId?: number;
  isActive: boolean;
}
// ----------------------------------------------------------------
// CRUD Action Responses
// ------------------------------------------------------------------ 

// Single Department Response

