import { z } from 'zod';

export const createDrugCartSchema = z.object({
  pasien_id: z.string().min(1, 'Pasien ID tidak boleh kosong'),
  obat_id: z.string().min(1, 'Obat ID tidak boleh kosong'),
  jumlah: z.number().min(1, 'Jumlah tidak boleh kurang dari 1'),
});

export const updateDrugCartSchema = z.object({
  jumlah: z.number().min(1, 'Jumlah tidak boleh kurang dari 1').optional(),
});