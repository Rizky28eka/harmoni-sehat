import { z } from 'zod';

export const createPatientSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong'),
  nama: z.string().min(1, 'Nama tidak boleh kosong').trim(),
  nik: z.string().length(16, 'NIK harus 16 karakter').trim(),
  tanggal_lahir: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir harus YYYY-MM-DD'),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan'], { message: 'Jenis kelamin tidak valid' }),
  alamat: z.string().min(1, 'Alamat tidak boleh kosong').trim(),
  no_telepon: z.string().min(1, 'Nomor telepon tidak boleh kosong').trim(),
});

export const updatePatientSchema = z.object({
  user_id: z.string().min(1, 'User ID tidak boleh kosong').optional(),
  nama: z.string().min(1, 'Nama tidak boleh kosong').trim().optional(),
  nik: z.string().length(16, 'NIK harus 16 karakter').trim().optional(),
  tanggal_lahir: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir harus YYYY-MM-DD').optional(),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan'], { message: 'Jenis kelamin tidak valid' }).optional(),
  alamat: z.string().min(1, 'Alamat tidak boleh kosong').trim().optional(),
  no_telepon: z.string().min(1, 'Nomor telepon tidak boleh kosong').trim().optional(),
});