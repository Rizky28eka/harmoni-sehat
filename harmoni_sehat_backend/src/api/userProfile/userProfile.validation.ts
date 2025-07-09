import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createUserProfileSchema = z.object({
  body: z.object({
    // user_id will come from req.user
    foto: z.string().url('Foto must be a valid URL').optional(),
    bio: z.string().optional(),
  }),
});

export const updateUserProfileSchema = z.object({
  body: z.object({
    foto: z.string().url('Foto must be a valid URL').optional(),
    bio: z.string().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>['body'];
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>['body'];
