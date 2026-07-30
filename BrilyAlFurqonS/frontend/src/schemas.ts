import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be under 255 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1024, 'Description must be under 1024 characters'),
  status: z.enum(['Todo', 'In Progress', 'Done']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  hour: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Hour must be 01–12'),
  minute: z.string().regex(/^[0-5]\d$/, 'Minute must be 00–59'),
  ampm: z.enum(['AM', 'PM']),
  deadline: z.string().nullable().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
