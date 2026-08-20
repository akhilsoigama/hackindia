import {Institute} from "./Institute";
import {IDepartment} from "./department";
import {IUserRolePermissionItem} from "./Roles";


export type IfacultyItem = {
  id: number;
  facultyName: string;
  facultyId: string;
  designation: string;
  facultyEmail: string;
  facultyMobile: string;
  departmentId: number;
  instituteId: number;
  roleId: number;
  isActive: boolean;
  createdAt: string;

  // Nested objects
  department: IDepartment;
  institute: Institute;
  role: IUserRolePermissionItem;
}

export type IcreateFaculty = {
  facultyName: string;
  facultyId: string;
  designation: string;
  facultyEmail: string;
  facultyMobile: string;
  departmentId: number;
  instituteId: number;
  roleId: number;
}

