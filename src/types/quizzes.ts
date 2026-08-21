// ========================================
// Main Quiz Type
// ========================================

export type IQuiz = {
  id: number

  quizTitle: string
  quizDescription?: string | null
  quizBanner?: string | null

  subject?: string | null
  std?: string | null

  instituteId: number
  facultyId: number
  departmentId: number

  dueDate: string
  marks: number
  attemptLimit: number

  isActive: boolean

  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}


// ========================================
// Create Quiz Type
// ========================================

export type ICreateQuiz = {
  quizTitle: string
  quizDescription?: string | null
  quizBanner?: string | null

  subject?: string | null
  std?: string | null

  instituteId: number
  facultyId: number
  departmentId: number

  dueDate: string
  marks: number
  attemptLimit: number

  isActive?: boolean
}


// ========================================
// Update Quiz Type
// ========================================

export type IUpdateQuiz = Partial<{
  id: number

  quizTitle: string
  quizDescription: string | null
  quizBanner: string | null

  subject: string | null
  std: string | null

  instituteId: number
  facultyId: number
  departmentId: number

  dueDate: string
  marks: number
  attemptLimit: number

  isActive: boolean

  updatedAt: string
}>


// ========================================
// Quiz Filters Type
// ========================================

export type IQuizFilters = {
  search?: string

  subject?: string
  std?: string
  departmentId?: number
  facultyId?: number
  instituteId?: number

  isActive?: boolean

  startDate?: string
  endDate?: string
}

export type IQuizWithRelations = IQuiz & {
  questionsCount?: number
  attemptsCount?: number
}


// ========================================
// Question Types
// ========================================

export type QuestionType = 'mcq' | 'true/false'

export type IOption = {
  id: number
  questionId: number
  optionText: string
  isCorrect: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type ICreateOption = {
  optionText: string
  isCorrect: boolean
}

export type IQuestion = {
  id: number
  quizId: number
  questionText: string
  questionType: QuestionType
  marks: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  options?: IOption[]
}

export type ICreateQuestion = {
  questionText: string
  questionType: QuestionType
  marks: number
  options: ICreateOption[]
}

export type IUpdateQuestion = Partial<{
  id: number
  quizId: number
  questionText: string
  questionType: QuestionType
  marks: number
  updatedAt: string
}>


// ========================================
// Quiz Attempt Types
// ========================================

export type IQuizAttempt = {
  id: number
  quizId: number
  studentId: number
  attemptNumber: number
  score: number
  maxScore: number
  percentage: number
  startedAt: string
  submittedAt?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type ICreateQuizAttempt = {
  quizId: number
  studentId: number
  attemptNumber: number
  score?: number
  maxScore: number
  startedAt: string
}

export type IUpdateQuizAttempt = Partial<{
  id: number
  score: number
  percentage: number
  submittedAt: string
  updatedAt: string
}>


// ========================================
// Legacy/Helper Types
// ========================================

export type ICreateQuestionWithOptions = {
  questionId: number

  options: {
    optionText: string
    isCorrect: boolean
  }[]
}