export interface Question {
  id: number;
  studentId: number | string;
  instituteId?: number;
  assignedFacultyId?: number | null;
  resolvedByUserId?: number | null;
  title: string;
  description: string;
  subject?: string;
  category?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  response?: string | null;
  resolvedAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  studentName: string;
  answeredBy?: string | null;
}

export interface NewQuestion {
  title: string;
  description: string;
  subject?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface AllQuestionsProps {
  onTabChange?: (tab: string) => void;
  onQuestionSelect?: (question: Question) => void;
}

export interface AnsweredQuestionsProps {
  onTabChange?: (tab: string) => void;
  onQuestionSelect?: (question: Question) => void;
}

export interface UnansweredQuestionsProps {
  onTabChange?: (tab: string) => void;
  onQuestionSelect?: (question: Question) => void;
  onAnswerSubmit?: (questionId: number, answer: string) => void;
}

export interface StudentQuestionsProps {
  studentId: string;
}

export interface AskQuestionProps {
  studentId?: string;
  onSubmitQuestion?: (question: NewQuestion) => void;
}