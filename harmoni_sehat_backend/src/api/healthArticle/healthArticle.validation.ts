import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createHealthArticleSchema = z.object({
  body: z.object({
    judul: z.string().min(1, 'Judul is required').trim(),
    slug: z.string().min(1, 'Slug is required').trim(),
    konten: z.string().min(1, 'Konten is required').trim(),
    author_id: objectIdValidation,
    author_type: z.enum(['Admin', 'Doctor']),
    status_publikasi: z.enum(['draft', 'published', 'archived']).default('draft'),
  }),
});

export const updateHealthArticleSchema = z.object({
  body: z.object({
    judul: z.string().min(1, 'Judul is required').trim().optional(),
    slug: z.string().min(1, 'Slug is required').trim().optional(),
    konten: z.string().min(1, 'Konten is required').trim().optional(),
    author_id: objectIdValidation.optional(),
    author_type: z.enum(['Admin', 'Doctor']).optional(),
    status_publikasi: z.enum(['draft', 'published', 'archived']).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateHealthArticleInput = z.infer<typeof createHealthArticleSchema>['body'];
export type UpdateHealthArticleInput = z.infer<typeof updateHealthArticleSchema>['body'];
