import { z } from 'zod';

export const createPrescriptionSchema = z.object({
  konsultasi_id: z.string().min(1, 'Konsultasi ID tidak boleh kosong'),
  catatan: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  expired_at: z.string().datetime('Format tanggal kedaluwarsa tidak valid'),
});

export const updatePrescriptionSchema = z.object({
  catatan: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  expired_at: z.string().datetime('Format tanggal kedaluwarsa tidak valid').optional(),
});