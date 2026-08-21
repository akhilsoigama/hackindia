import { z } from 'zod';

// File constraints
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
];

// ========================================
// Assignment Upload Create Schema
// ========================================

export const createAssignmentUploadSchema = z.object({
  assignmentId: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? val : String(val)))
    .refine((val) => val.length > 0, 'Assignment is required'),

  assignmentFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'File size must be less than 10MB',
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message:
        'Only PDF, DOC, DOCX, and ZIP files are allowed. ' +
        'Accepted types: application/pdf, application/msword, ' +
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document, ' +
        'application/zip, application/x-zip-compressed',
    }),

  comments: z
    .string()
    .max(500, 'Comments must not exceed 500 characters')
    .optional(),

  isActive: z.boolean().default(true),
});

// ========================================
// Assignment Upload Update Schema
// ========================================

export const uploadAssignmentUploadSchema = z.object({
  assignmentId: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? val : String(val)))
    .refine((val) => val.length > 0, 'Assignment is required'),

  assignmentFile: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: 'File size must be less than 10MB',
    })
    .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
      message: 'Only PDF, DOC, DOCX, and ZIP files are allowed',
    }),

  comments: z
    .string()
    .max(500, 'Comments must not exceed 500 characters')
    .optional(),

  isActive: z.boolean().default(true),
});

// Type exports
export type CreateAssignmentUploadInput = z.infer<
  typeof createAssignmentUploadSchema
>;
export type UploadAssignmentUploadInput = z.infer<
  typeof uploadAssignmentUploadSchema
>;
