import { z } from 'zod';

export const today = new Date().toISOString().split('T')[0];

export const leaveSchema = z
  .object({
    leaveType: z.string().min(1, 'Leave type is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z.string().min(10, 'Please provide at least 10 characters'),
  })
  .refine(
    (d) => !d.startDate || !d.endDate || new Date(d.endDate) >= new Date(d.startDate),
    { message: 'End date must be on or after start date', path: ['endDate'] }
  );

export type LeaveFormValues = z.infer<typeof leaveSchema>;
