import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createRoleSchema = z.object({
  body: z.object({
    nama_peran: z.string().min(1, 'Nama peran is required').trim(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    nama_peran: z.string().min(1, 'Nama peran is required').trim().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>['body'];
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>['body'];
