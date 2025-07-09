import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createActivityLogSchema = z.object({
  body: z.object({
    user_id: objectIdValidation,
    aksi: z.string().min(1, 'Aksi is required').trim(),
    deskripsi: z.string().optional(),
    timestamp: z.string().datetime('Invalid date format').transform((str) => new Date(str)).optional(),
  }),
});

export const updateActivityLogSchema = z.object({
  body: z.object({
    user_id: objectIdValidation.optional(),
    aksi: z.string().min(1, 'Aksi is required').trim().optional(),
    deskripsi: z.string().optional(),
    timestamp: z.string().datetime('Invalid date format').transform((str) => new Date(str)).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateActivityLogInput = z.infer<typeof createActivityLogSchema>['body'];
export type UpdateActivityLogInput = z.infer<typeof updateActivityLogSchema>['body'];
