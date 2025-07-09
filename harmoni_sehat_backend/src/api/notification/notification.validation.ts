import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createNotificationSchema = z.object({
  body: z.object({
    user_id: objectIdValidation,
    judul: z.string().min(1, 'Judul is required').trim(),
    isi: z.string().min(1, 'Isi is required').trim(),
    tipe: z.enum(['info', 'warning', 'error', 'success']),
    is_read: z.boolean().optional(),
  }),
});

export const updateNotificationSchema = z.object({
  body: z.object({
    judul: z.string().min(1, 'Judul is required').trim().optional(),
    isi: z.string().min(1, 'Isi is required').trim().optional(),
    tipe: z.enum(['info', 'warning', 'error', 'success']).optional(),
    is_read: z.boolean().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>['body'];
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>['body'];
