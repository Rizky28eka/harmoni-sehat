import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createRefreshTokenSchema = z.object({
  body: z.object({
    user_id: objectIdValidation,
    token: z.string().min(1, 'Token is required').trim(),
    expired_at: z.string().datetime('Invalid date format').transform((str) => new Date(str)),
  }),
});

export const updateRefreshTokenSchema = z.object({
  body: z.object({
    user_id: objectIdValidation.optional(),
    token: z.string().min(1, 'Token is required').trim().optional(),
    expired_at: z.string().datetime('Invalid date format').transform((str) => new Date(str)).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateRefreshTokenInput = z.infer<typeof createRefreshTokenSchema>['body'];
export type UpdateRefreshTokenInput = z.infer<typeof updateRefreshTokenSchema>['body'];
