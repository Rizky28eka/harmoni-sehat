import { z } from 'zod';

export const createTransactionSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  total_biaya: z.number().min(0, 'Total biaya tidak boleh negatif'),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  metode_pembayaran_id: z.string().min(1, 'Metode pembayaran ID tidak boleh kosong'),
  external_id: z.string().optional(),
  transaksiable_id: z.string().min(1, 'Transaksiable ID tidak boleh kosong'),
  transaksiable_type: z.string().min(1, 'Transaksiable Type tidak boleh kosong').trim(),
});

export const updateTransactionSchema = z.object({
  total_biaya: z.number().min(0, 'Total biaya tidak boleh negatif').optional(),
  status: z.enum(['pending', 'completed', 'failed']).optional(),
  metode_pembayaran_id: z.string().min(1, 'Metode pembayaran ID tidak boleh kosong').optional(),
  external_id: z.string().optional(),
  transaksiable_id: z.string().min(1, 'Transaksiable ID tidak boleh kosong').optional(),
  transaksiable_type: z.string().min(1, 'Transaksiable Type tidak boleh kosong').trim().optional(),
});