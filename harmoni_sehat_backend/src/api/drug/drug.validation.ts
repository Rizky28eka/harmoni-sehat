import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdValidation = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createDrugSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim(),
    deskripsi: z.string().optional(),
    kategori: z.string().min(1, 'Kategori is required').trim(),
    harga: z.number().min(0, 'Harga must be non-negative'),
    stok: z.number().int().min(0, 'Stok must be a non-negative integer'),
    satuan: z.string().min(1, 'Satuan is required').trim(),
    butuh_resep: z.boolean().default(false),
    tgl_kadaluarsa: z.string().datetime('Invalid date format').transform((str) => new Date(str)),
  }),
});

export const updateDrugSchema = z.object({
  body: z.object({
    nama: z.string().min(1, 'Nama is required').trim().optional(),
    deskripsi: z.string().optional(),
    kategori: z.string().min(1, 'Kategori is required').trim().optional(),
    harga: z.number().min(0, 'Harga must be non-negative').optional(),
    stok: z.number().int().min(0, 'Stok must be a non-negative integer').optional(),
    satuan: z.string().min(1, 'Satuan is required').trim().optional(),
    butuh_resep: z.boolean().optional(),
    tgl_kadaluarsa: z.string().datetime('Invalid date format').transform((str) => new Date(str)).optional(),
  }).partial(),
  params: z.object({
    id: objectIdValidation,
  }),
});

export type CreateDrugInput = z.infer<typeof createDrugSchema>['body'];
export type UpdateDrugInput = z.infer<typeof updateDrugSchema>['body'];
