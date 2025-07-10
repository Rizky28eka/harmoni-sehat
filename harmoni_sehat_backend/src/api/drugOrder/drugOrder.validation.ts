import { z } from 'zod';

export const createDrugOrderSchema = z.object({
  pasien_id: z.string().min(1, 'Pasien ID tidak boleh kosong'),
  kode_pesanan: z.string().min(1, 'Kode pesanan tidak boleh kosong').trim(),
  total_harga: z.number().min(0, 'Total harga tidak boleh negatif'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  alamat_pengiriman: z.string().min(1, 'Alamat pengiriman tidak boleh kosong').trim(),
});

export const updateDrugOrderSchema = z.object({
  total_harga: z.number().min(0, 'Total harga tidak boleh negatif').optional(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  alamat_pengiriman: z.string().min(1, 'Alamat pengiriman tidak boleh kosong').trim().optional(),
});