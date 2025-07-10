import { z } from 'zod';

export const createDrugOrderDetailSchema = z.object({
  pesanan_id: z.string().min(1, 'Pesanan ID tidak boleh kosong'),
  obat_id: z.string().min(1, 'Obat ID tidak boleh kosong'),
  jumlah: z.number().min(1, 'Jumlah tidak boleh kurang dari 1'),
  harga_satuan: z.number().min(0, 'Harga satuan tidak boleh negatif'),
  subtotal: z.number().min(0, 'Subtotal tidak boleh negatif'),
});

export const updateDrugOrderDetailSchema = z.object({
  jumlah: z.number().min(1, 'Jumlah tidak boleh kurang dari 1').optional(),
  harga_satuan: z.number().min(0, 'Harga satuan tidak boleh negatif').optional(),
  subtotal: z.number().min(0, 'Subtotal tidak boleh negatif').optional(),
});