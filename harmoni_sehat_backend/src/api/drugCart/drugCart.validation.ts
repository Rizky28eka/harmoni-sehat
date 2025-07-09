import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createDrugCartSchema = z.object({
  body: z.object({
    drug_id: objectIdValidation,
    jumlah: z.number().int().min(1, 'Jumlah must be at least 1'),
  }),
});

export const updateDrugCartSchema = z.object({
  body: z.object({
    jumlah: z.number().int().min(1, 'Jumlah must be at least 1').optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateDrugCartInput = z.infer<typeof createDrugCartSchema>['body'];
export type UpdateDrugCartInput = z.infer<typeof updateDrugCartSchema>['body'];
