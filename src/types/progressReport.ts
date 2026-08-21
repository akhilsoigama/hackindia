export type ProgressReportSubjectStatus = 'excellent' | 'good' | 'needs_help' | 'average';

export interface ProgressReportSubject {
  subject: string;
  totalQuizzes: number;
  totalAssignments: number;
  quizMarksTotal: number;
  quizMarksAverage: number;
  assignmentSubmissionMarksTotal: number;
  assignmentSubmissionMarksAverage: number;
  overallScore: number;
  status: ProgressReportSubjectStatus;
}

export interface ProgressReportStudent {
  id: number;
  studentName: string;
  studentGrNo: number;
  studentStd?: string;
  studentDegree?: string | null;
  studentSemester?: string | null;
  departmentName?: string;
}

export interface ProgressReportData {
  studentId: number;
  instituteId: number;
  student: ProgressReportStudent | null;
  subjectProgress: ProgressReportSubject[] | undefined;
  totalOverAllScore: number;
  strengths: string[];
  weakSubjects: string[];
  generatedAt: string;
  activities?: any[];
  stats?: {
    completedModules: number;
    totalModules: number;
    completedTasks: number;
    totalTasks: number;
    attendance: number;
  };
}

export interface ProgressReportFilters {
  studentId?: number;
  instituteId?: number;
  departmentId?: number;
}