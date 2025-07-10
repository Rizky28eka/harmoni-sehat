import { z } from 'zod';

export const createPrescriptionDrugSchema = z.object({
  resep_id: z.string().min(1, 'Resep ID tidak boleh kosong'),
  obat_id: z.string().min(1, 'Obat ID tidak boleh kosong'),
  dosis: z.string().min(1, 'Dosis tidak boleh kosong').trim(),
  jumlah: z.number().min(1, 'Jumlah tidak boleh kurang dari 1'),
  aturan_pakai: z.string().min(1, 'Aturan pakai tidak boleh kosong').trim(),
});

export const updatePrescriptionDrugSchema = z.object({
  dosis: z.string().min(1, 'Dosis tidak boleh kosong').trim().optional(),
  jumlah: z.number().min(1, 'Jumlah tidak boleh kurang dari 1').optional(),
  aturan_pakai: z.string().min(1, 'Aturan pakai tidak boleh kosong').trim().optional(),
});