import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createDrugOrderSchema = z.object({
  body: z.object({
    kode_pesanan: z.string().min(1, 'Kode pesanan is required').trim(),
    total_harga: z.number().min(0, 'Total harga must be non-negative'),
    alamat_pengiriman: z.string().min(1, 'Alamat pengiriman is required').trim(),
    // status will default to 'pending'
  }),
});

export const updateDrugOrderSchema = z.object({
  body: z.object({
    kode_pesanan: z.string().min(1, 'Kode pesanan is required').trim().optional(),
    total_harga: z.number().min(0, 'Total harga must be non-negative').optional(),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
    alamat_pengiriman: z.string().min(1, 'Alamat pengiriman is required').trim().optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateDrugOrderInput = z.infer<typeof createDrugOrderSchema>['body'];
export type UpdateDrugOrderInput = z.infer<typeof updateDrugOrderSchema>['body'];
