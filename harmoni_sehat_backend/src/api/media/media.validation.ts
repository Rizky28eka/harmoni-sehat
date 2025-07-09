import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createMediaSchema = z.object({
  body: z.object({
    model_type: z.string().min(1, 'Model type is required').trim(),
    model_id: objectIdValidation,
    url: z.string().url('URL must be a valid URL').trim(),
    mime_type: z.string().optional(),
    size: z.number().int().min(0, 'Size must be non-negative').optional(),
  }),
});

export const updateMediaSchema = z.object({
  body: z.object({
    model_type: z.string().min(1, 'Model type is required').trim().optional(),
    model_id: objectIdValidation.optional(),
    url: z.string().url('URL must be a valid URL').trim().optional(),
    mime_type: z.string().optional(),
    size: z.number().int().min(0, 'Size must be non-negative').optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateMediaInput = z.infer<typeof createMediaSchema>['body'];
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>['body'];
