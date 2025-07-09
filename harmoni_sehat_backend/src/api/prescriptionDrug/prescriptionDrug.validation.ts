import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createPrescriptionDrugSchema = z.object({
  body: z.object({
    prescription_id: objectIdValidation,
    drug_id: objectIdValidation,
    dosis: z.string().min(1, 'Dosis is required').trim(),
    jumlah: z.number().int().min(1, 'Jumlah must be at least 1'),
    aturan_pakai: z.string().min(1, 'Aturan pakai is required').trim(),
  }),
});

export const updatePrescriptionDrugSchema = z.object({
  body: z.object({
    dosis: z.string().min(1, 'Dosis is required').trim().optional(),
    jumlah: z.number().int().min(1, 'Jumlah must be at least 1').optional(),
    aturan_pakai: z.string().min(1, 'Aturan pakai is required').trim().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreatePrescriptionDrugInput = z.infer<typeof createPrescriptionDrugSchema>['body'];
export type UpdatePrescriptionDrugInput = z.infer<typeof updatePrescriptionDrugSchema>['body'];
