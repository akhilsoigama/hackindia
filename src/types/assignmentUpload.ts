export interface IAssignment {
  id: string;
  title: string;
  course: string;
  subject?: string;
  dueDate: string;
  dueTime: string;
  description: string;
  instructions: string;
  maxPoints: number;
  status: 'pending' | 'submitted' | 'late';
}

export interface IFileWithPreview {
  file: File;
  id: string;
}

export interface IAssignmentUploadFormValues {
  assignmentId: string;
  assignmentFile: string;
  isActive?: boolean;
  comments?: string;
}

export interface IAssignmentUploadCreatePayload {
  assignmentId: string;
  isActive: boolean;
  assignmentFile: string;
  comments?: string;
}

export interface IAssignmentUploadResponse {
  id: number;
  assignmentId: number;
  studentId: number;
  facultyId?: number | null;
  instituteId?: number | null;
  departmentId?: number | null;
  assignmentFile: string;
  comments?: string;
  isSubmitted: boolean;
  isGradedByFaculty?: boolean;
  isGraded: boolean;
  isActive?: boolean;
  marks?: number | null;
  grad?: number | string | null;
  createdAt: string;
  updatedAt: string;
  Assignment?: {
    id: number;
    assignmentTitle?: string;
    assignmentDescription?: string;
    subject?: string;
    title?: string;
    assignmentFile?: string;
    instituteId?: number;
    facultyId?: number;
    departmentId?: number;
    std?: string;
    maxPoints?: number;
    dueDate?: string;
    marks?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
  } | null;
  Faculty?: {
    id: number;
    facultyName: string;
  } | null;
  Student?: {
    id: number;
    studentId?: string;
    studentGrNo?: string | number;
    studentName?: string;
  } | null;
  Department?: Record<string, unknown> | null;
  Institute?: Record<string, unknown> | null;
}

export interface IAssignmentUploadListItem {
  id: string;
  assignmentId?: string;
  isActive?: boolean;
  facultyName?: string;
  grad?: string | number | null;
  studentName?: string;
  studentId?: string;
  studentGrNo?: string;
  title: string;
  subject: string;
  submittedDate?: string;
  assignmentFile: string;
  comments?: string;
  status: 'submitted' | 'pending' | 'late' | 'graded';
  fileType: 'pdf' | 'doc' | 'image' | 'zip';
  fileSize: string;
  marks?: number;
  maxPoints: number;
  Faculty?: {
    id: number;
    facultyName: string;
  } | null;
}

export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ASSIGNMENT_UPLOAD_STEPS = [
  { id: 1, label: 'Select Assignment', icon: 'MenuBook' },
  { id: 2, label: 'Upload Files', icon: 'CloudUpload' },
  { id: 3, label: 'Review & Submit', icon: 'Verified' },
];
