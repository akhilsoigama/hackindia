// Department entity
export interface IDepartment {
  id: number;
  departmentName: string;
  departmentCode: string;
  description: string;
  isActive: boolean;
  createdAt: string; 
  updatedAt: string; 
  deletedAt: string | null;
}

// Create Department
export interface ICreateDepartment {
  departmentName: string;
  departmentCode: string;
  description?: string;
  isActive?: boolean;
}

// Update Department
export interface IUpdateDepartment {
  departmentName?: string;
  departmentCode?: string;
  description?: string;
  isActive?: boolean;
}

/* ------------------------------------------------------------------
CRUD RESPONSE TYPES
------------------------------------------------------------------ */

// Single Department Response
export interface IDepartmentResponse {
  success: boolean;
  data: IDepartment;
}

// List of Departments Response
export interface DepartmentListResponse {
  success: boolean;
  data: IDepartment[];
}
