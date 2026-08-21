export type QuestionStatus =
  | "answered"
  | "unanswered"

export type QuestionPriority =
  | "high"
  | "medium"
  | "low"

export type IQuestion = {
  id: number

  studentName: string
  studentId: number | string

  course: string
  subject: string

  title: string
  question: string

  status: QuestionStatus
  priority: QuestionPriority

  answer?: string | null
  answeredBy?: string | null
  answeredById?: number | null
  answerTimestamp?: string | null

  tags?: string[] | null
  upvotes: number

  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type Question = {
  id: number
  studentName: string
  studentId: number | string
  course: string
  subject: string
  title: string
  question: string
  timestamp?: string
  status: QuestionStatus
  priority: QuestionPriority
  answer?: string | null
  answeredBy?: string | null
  answerTimestamp?: string | null
  tags: string[]
  upvotes: number
}

export type AnsweredQuestionsProps = {
  onQuestionSelect?: (question: Question) => void
}

export type UnansweredQuestionsProps = {
  onAnswerSubmit?: (questionId: number, answer: string) => void
}

export type ICreateQuestion = {
  studentId: number

  course: string
  subject: string

  title: string
  question: string

  priority?: QuestionPriority
  tags?: string[] | null

  status?: QuestionStatus
}

export type IUpdateQuestion = Partial<{
  id: number

  title: string
  question: string

  status: QuestionStatus
  priority: QuestionPriority

  answer: string | null
  answeredBy: string | null
  answeredById: number | null
  answerTimestamp: string | null

  tags: string[] | null
  upvotes: number

  updatedAt: string
}>

export type IQuestionFilters = {
  search?: string

  status?: QuestionStatus
  priority?: QuestionPriority

  course?: string
  subject?: string
  studentId?: number

  startDate?: string
  endDate?: string
}

// ========================================
// Option Type
// ========================================

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
  questionId: number
  optionText: string
  isCorrect?: boolean
}

export type IUpdateOption = Partial<{
  id: number
  optionText: string
  isCorrect: boolean
  updatedAt: string
}>