import { z } from 'zod';

export const createDrugSchema = z.object({
  nama: z.string().min(1, 'Nama obat tidak boleh kosong').trim(),
  deskripsi: z.string().optional(),
  kategori: z.string().min(1, 'Kategori tidak boleh kosong').trim(),
  stok: z.number().min(0, 'Stok tidak boleh negatif'),
  satuan: z.string().min(1, 'Satuan tidak boleh kosong').trim(),
  harga: z.number().min(0, 'Harga tidak boleh negatif'),
  kode_obat: z.string().min(1, 'Kode obat tidak boleh kosong').trim(),
  butuh_resep: z.boolean().optional(),
  tgl_kadaluarsa: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal kedaluwarsa harus YYYY-MM-DD'),
});

export const updateDrugSchema = z.object({
  nama: z.string().min(1, 'Nama obat tidak boleh kosong').trim().optional(),
  deskripsi: z.string().optional(),
  kategori: z.string().min(1, 'Kategori tidak boleh kosong').trim().optional(),
  stok: z.number().min(0, 'Stok tidak boleh negatif').optional(),
  satuan: z.string().min(1, 'Satuan tidak boleh kosong').trim().optional(),
  harga: z.number().min(0, 'Harga tidak boleh negatif').optional(),
  kode_obat: z.string().min(1, 'Kode obat tidak boleh kosong').trim().optional(),
  butuh_resep: z.boolean().optional(),
  tgl_kadaluarsa: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal kedaluwarsa harus YYYY-MM-DD').optional(),
});