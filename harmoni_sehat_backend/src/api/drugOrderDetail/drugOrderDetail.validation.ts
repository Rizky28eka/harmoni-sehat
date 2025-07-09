import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createDrugOrderDetailSchema = z.object({
  body: z.object({
    order_id: objectIdValidation,
    drug_id: objectIdValidation,
    harga_satuan: z.number().min(0, 'Harga satuan must be non-negative'),
    jumlah: z.number().int().min(1, 'Jumlah must be at least 1'),
    subtotal: z.number().min(0, 'Subtotal must be non-negative'),
  }),
});

export const updateDrugOrderDetailSchema = z.object({
  body: z.object({
    order_id: objectIdValidation.optional(),
    drug_id: objectIdValidation.optional(),
    harga_satuan: z.number().min(0, 'Harga satuan must be non-negative').optional(),
    jumlah: z.number().int().min(1, 'Jumlah must be at least 1').optional(),
    subtotal: z.number().min(0, 'Subtotal must be non-negative').optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateDrugOrderDetailInput = z.infer<typeof createDrugOrderDetailSchema>['body'];
export type UpdateDrugOrderDetailInput = z.infer<typeof updateDrugOrderDetailSchema>['body'];
