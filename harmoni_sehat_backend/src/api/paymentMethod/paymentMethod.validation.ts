import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createPaymentMethodSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim(),
    kode: z.string().min(1, 'Kode is required').trim(),
    deskripsi: z.string().optional(),
    is_active: z.boolean().optional(),
  }),
});

export const updatePaymentMethodSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim().optional(),
    kode: z.string().min(1, 'Kode is required').trim().optional(),
    deskripsi: z.string().optional(),
    is_active: z.boolean().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>['body'];
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>['body'];
