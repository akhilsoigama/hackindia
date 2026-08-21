// types/overview.ts

// Base overview interfaces
export interface IInstituteOverview {
  role: "Institute";
  totalStudents: number;
  totalFaculties: number;
  totalDepartments: number;
  totalEvents: number;
}

export interface IFacultyOverview {
  role: "Faculty";
  totalAssignments: number;
  totalQuizzes: number;
  totalLeaves: number;
  totalLectures: number;
}

export interface IStudentOverview {
  role: "Student";
  totalAssignmentsSubmitted: number;
  totalQuizAttempts: number;
}

export type IOverview =
  | IInstituteOverview
  | IFacultyOverview
  | IStudentOverview;

// Response interfaces for API
export interface IOverviewResponse {
  status: boolean;
  message: string;
  data: IOverview;
}

// New interfaces for growth data
export interface IPeriodData {
  period: string; // e.g., "January 2026"
  totalStudents?: number;
  totalFaculties?: number;
  totalDepartments?: number;
  totalAssignments?: number;
  totalQuizzes?: number;
  totalLeaves?: number;
  totalLectures?: number;
  totalAssignmentsSubmitted?: number;
  totalQuizAttempts?: number;
  totalEvents?: number;
}

export interface IGrowthData {
  students?: number;
  faculties?: number;
  departments?: number;
  assignments?: number;
  events?: number;
  quizzes?: number;
  leaves?: number;
  lectures?: number;
  assignmentsSubmitted?: number;
  quizAttempts?: number;
}

export interface IOverviewWithGrowth {
  current: IPeriodData;
  previous: IPeriodData;
  growth: IGrowthData;
}

export interface IOverviewWithGrowthResponse {
  status: boolean;
  message: string;
  data: IOverviewWithGrowth;
}

// Combined type for component usage
export interface IOverviewComponentData {
  currentOverview: IOverview | null;
  previousOverview: IOverview | null;
  growth: IGrowthData;
  currentPeriod?: string;
  previousPeriod?: string;
}

// Type guards
export const isInstituteOverview = (data: any): data is IInstituteOverview => {
  return data?.role === "Institute" || ('totalStudents' in data && 'totalFaculties' in data && 'totalDepartments' in data);
};

export const isFacultyOverview = (data: any): data is IFacultyOverview => {
  return data?.role === "Faculty" || ('totalAssignments' in data && 'totalQuizzes' in data && 'totalLeaves' in data && 'totalLectures' in data);
};

export const isStudentOverview = (data: any): data is IStudentOverview => {
  return data?.role === "Student" || ('totalAssignmentsSubmitted' in data && 'totalQuizAttempts' in data);
};

// Helper function to convert period data to overview format
export const convertToOverview = (periodData: IPeriodData, role: string): IOverview | null => {
  switch (role.toLowerCase()) {
    case "institute":
      return {
        role: "Institute",
        totalStudents: periodData.totalStudents || 0,
        totalFaculties: periodData.totalFaculties || 0,
        totalDepartments: periodData.totalDepartments || 0,
        totalEvents: periodData.totalEvents || 0,
      };
    case "faculty":
      return {
        role: "Faculty",
        totalAssignments: periodData.totalAssignments || 0,
        totalQuizzes: periodData.totalQuizzes || 0,
        totalLeaves: periodData.totalLeaves || 0,
        totalLectures: periodData.totalLectures || 0,
      };
    case "student":
      return {
        role: "Student",
        totalAssignmentsSubmitted: periodData.totalAssignmentsSubmitted || 0,
        totalQuizAttempts: periodData.totalQuizAttempts || 0,
      };
    default:
      return null;
  }
};