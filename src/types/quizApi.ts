import type { ApiResponse } from "./api";
import type { QuestionType } from "./quizzes";

export type ValidationMessage = {
  field: string;
  message: string;
};

export type QuizOptionDto = {
  id?: number;
  optionText: string;
  isCorrect?: boolean;
};

export type QuizOption = {
  id: number;
  optionText: string;
  isCorrect: boolean;
};

export type QuizQuestionDto = {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  correctOptionId?: number;
  options?: QuizOptionDto[];
};

export type QuizQuestion = {
  id: number;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  correctOptionId?: number;
  options: QuizOption[];
};

export type QuizRelation = {
  id: number;
  instituteName?: string;
  facultyName?: string;
  facultyEmail?: string;
  departmentName?: string;
};

export type QuizDetails = {
  id: number;
  quizTitle: string;
  quizDescription?: string | null;
  quizBanner: string;
  subject?: string | null;
  std?: string | null;
  dueDate?: string;
  marks?: number;
  attemptLimit?: number;
  isActive?: boolean;
  instituteId: number;
  facultyId: number;
  departmentId: number;
  institute?: QuizRelation;
  faculty?: QuizRelation;
  department?: QuizRelation;
  questions?: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateQuizDto = {
  quizTitle: string;
  quizDescription?: string | null;
  quizBanner: string;
  subject?: string | null;
  std?: string | null;
  dueDate?: string;
  marks?: number;
  attemptLimit?: number;
  isActive?: boolean;
  instituteId: number;
  facultyId: number;
  departmentId: number;
  questions?: QuizQuestionDto[];
};

export type CreateQuizFormDto = Omit<CreateQuizDto, "instituteId" | "facultyId">;

export type UpdateQuizDto = Partial<
  Omit<CreateQuizDto, "instituteId" | "facultyId" | "departmentId"> & {
    instituteId: number;
    facultyId: number;
    departmentId: number;
  }
>;

export type QuizAttemptDetails = {
  id: number;
  quizId: number;
  studentId: number;
  instituteId: number;
  student?: {
    studentName: string;
  };
  attemptedAt: Date | string;
  status: "in_progress" | "submitted" | "completed";
  score?: number | null;
  quiz?: QuizDetails;
  institute?: QuizRelation;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateQuizAttemptDto = {
  quizId: number;
  studentId: number;
  instituteId: number;
  attemptedAt: Date;
  status: "in_progress" | "submitted" | "completed";
  score?: number;
};

export type UpdateQuizAttemptDto = Partial<
  Omit<CreateQuizAttemptDto, "quizId" | "studentId">
>;

export type QuizListQuery = {
  searchFor?: string;
};

export type QuizAttemptListQuery = {
  searchFor?: string;
  search?: string;
  quizId?: number;
  studentId?: number;
  page?: number;
  limit?: number;
};

export interface QuizApiResponse<T> extends Omit<ApiResponse<T>, "success"> {
  status: boolean;
  success?: boolean;
  message: string;
  data: T;
  error?: {
    messages?: ValidationMessage[];
  } | string;
  meta?: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}