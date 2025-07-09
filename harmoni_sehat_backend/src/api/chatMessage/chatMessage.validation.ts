import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createChatMessageSchema = z.object({
  body: z.object({
    consultation_id: objectIdValidation,
    // sender_id will come from req.user
    isi: z.string().min(1, 'Isi pesan is required').trim(),
    tipe: z.enum(['text', 'image', 'document']),
    file_url: z.string().url('File URL must be a valid URL').optional(),
    is_read: z.boolean().optional(),
  }),
});

export const updateChatMessageSchema = z.object({
  body: z.object({
    isi: z.string().min(1, 'Isi pesan is required').trim().optional(),
    tipe: z.enum(['text', 'image', 'document']).optional(),
    file_url: z.string().url('File URL must be a valid URL').optional(),
    is_read: z.boolean().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateChatMessageInput = z.infer<typeof createChatMessageSchema>['body'];
export type UpdateChatMessageInput = z.infer<typeof updateChatMessageSchema>['body'];
