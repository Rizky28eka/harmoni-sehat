import { z } from 'zod';

export const createPaymentMethodSchema = z.object({
  nama: z.string().min(1, 'Nama metode pembayaran tidak boleh kosong').trim(),
  kode: z.string().min(1, 'Kode metode pembayaran tidak boleh kosong').trim(),
  deskripsi: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const updatePaymentMethodSchema = z.object({
  nama: z.string().min(1, 'Nama metode pembayaran tidak boleh kosong').trim().optional(),
  kode: z.string().min(1, 'Kode metode pembayaran tidak boleh kosong').trim().optional(),
  deskripsi: z.string().optional(),
  is_active: z.boolean().optional(),
});