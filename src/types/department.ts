// Department entity
export type IDepartment= {
  id: number;
  departmentName: string;
  departmentCode: string;
  description: string;
  instituteId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Create Department
export type ICreateDepartment ={
  departmentName: string;
  departmentCode: string;
  description?: string;
  instituteId?:number;
  isActive?: boolean;
}

// Update Department
export type IUpdateDepartment= {
  id?: number;
  departmentName?: string;
  departmentCode?: string;
  description?: string;
  instituteId?:number;
  isActive?: boolean;
}

/* ------------------------------------------------------------------
CRUD RESPONSE TYPES
------------------------------------------------------------------ */

// Single Department Response
export type IDepartmentResponse ={
  success: boolean;
  data: IDepartment;
}

// List of Departments Response
export type DepartmentListResponse ={
  success: boolean;
  data: IDepartment[];
}


export interface DepartmentListProps {
  departments: IDepartment[];
  onEdit?: (department: IDepartment) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}
