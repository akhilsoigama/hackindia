import { z } from 'zod';

// ========================================
// Option Schema
// ========================================

export const optionSchema = z.object({
  optionText: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

// ========================================
// Question Schema
// ========================================

export const questionSchema = z.object({
  questionText: z.string().min(1, 'Question text is required'),
  questionType: z.enum(['mcq', 'true/false'], {
    message: 'Question type is required',
  }),
  marks:  z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "number" ? val : Number(val)))
    .refine((val) => Number.isFinite(val) && val >= 1, {
      message: "Marks must be at least 1",
    }),
  options: z
    .array(optionSchema)
    .min(2, 'At least 2 options are required')
    .refine(
      (options) => options.some((opt) => opt.isCorrect),
      'At least one option must be marked as correct'
    ),
});

// ========================================
// Quiz Create Schema
// ========================================

export const createQuizSchema = z.object({
  // Basic Information
  quizTitle: z
    .string()
    .min(3, 'Quiz title must be at least 3 characters')
    .max(200, 'Quiz title cannot exceed 200 characters'),
  
  quizDescription: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .nullable(),
  
  quizBanner: z
    .string()
    .url('Invalid banner URL')
    .optional()
    .nullable(),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .optional()
    .nullable(),
  
  std: z
    .string()
    .min(1, 'Standard is required')
    .optional()
    .nullable(),
  
  // IDs
  departmentId: z.number().positive('Department ID is required'),
  
  // Settings
  dueDate: z.string().min(1, 'Due date is required'),
  
  marks: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "number" ? val : Number(val)))
    .refine((val) => Number.isFinite(val) && val >= 1, {
      message: "Marks must be at least 1",
    }),
  
  attemptLimit: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "number" ? val : Number(val)))
    .refine((val) => Number.isFinite(val) && val >= 1, {
      message: "Attempt limit must be at least 1",
    }),
  
  isActive: z.boolean(),  
  // Questions
  questions: z
    .array(questionSchema)
    .min(1, 'At least one question is required'),
});

// ========================================
// Quiz Update Schema (all fields optional)
// ========================================

export const updateQuizSchema = createQuizSchema.partial();

// ========================================
// Type Inference
// ========================================

// Output types (after Zod parsing) — use for submit handler payload
export type CreateQuizFormData = z.infer<typeof createQuizSchema>;
export type UpdateQuizFormData = z.infer<typeof updateQuizSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type OptionFormData = z.infer<typeof optionSchema>;

// Input types (what the form field values look like) — use for useForm<T> generic
// Since we removed .default(), z.input === z.output, so these are the same.
export type CreateQuizInput = z.input<typeof createQuizSchema>;
export type UpdateQuizInput = z.input<typeof updateQuizSchema>;
