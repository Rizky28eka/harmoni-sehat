import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createTransactionSchema = z.object({
  body: z.object({
    // user_id will come from req.user
    total_biaya: z.number().min(0, 'Total biaya must be non-negative'),
    status: z.enum(['pending', 'completed', 'failed', 'refunded']).default('pending'),
    payment_method_id: objectIdValidation,
    external_id: z.string().optional(),
    transaksiable_id: objectIdValidation,
    transaksiable_type: z.enum(['Consultation', 'DrugOrder']),
  }),
});

export const updateTransactionSchema = z.object({
  body: z.object({
    total_biaya: z.number().min(0, 'Total biaya must be non-negative').optional(),
    status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
    payment_method_id: objectIdValidation.optional(),
    external_id: z.string().optional(),
    transaksiable_id: objectIdValidation.optional(),
    transaksiable_type: z.enum(['Consultation', 'DrugOrder']).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>['body'];
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>['body'];
