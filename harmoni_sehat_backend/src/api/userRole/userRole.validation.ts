import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createUserRoleSchema = z.object({
  body: z.object({
    user_id: objectIdValidation,
    role_id: objectIdValidation,
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    user_id: objectIdValidation.optional(),
    role_id: objectIdValidation.optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateUserRoleInput = z.infer<typeof createUserRoleSchema>['body'];
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>['body'];
