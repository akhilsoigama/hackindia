export type StudentQueryPriority = 'low' | 'medium' | 'high';
export type StudentQueryStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface StudentQueryItem {
  id: number;
  studentId: number;
  instituteId: number;
  assignedFacultyId?: number | null;
  resolvedByUserId?: number | null;
  title: string;
  description: string;
  subject?: string | null;
  category?: string | null;
  priority: StudentQueryPriority;
  status: StudentQueryStatus;
  response?: string | null;
  resolvedAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  student?: {
    id?: number;
    studentName?: string;
    studentId?: string;
  };
  assignedFaculty?: {
    id?: number;
    facultyName?: string;
    facultyId?: string;
  };
}

export interface StudentQueryListFilters {
  page?: number;
  limit?: number;
  status?: StudentQueryStatus;
  priority?: StudentQueryPriority;
}

export interface CreateStudentQueryPayload {
  title: string;
  description: string;
  subject?: string;
  category?: string;
  priority?: StudentQueryPriority;
  assignedFacultyId?: number;
}

export interface UpdateStudentQueryPayload {
  title?: string;
  description?: string;
  subject?: string;
  category?: string;
  priority?: StudentQueryPriority;
  status?: StudentQueryStatus;
  response?: string;
  assignedFacultyId?: number;
  isActive?: boolean;
}
