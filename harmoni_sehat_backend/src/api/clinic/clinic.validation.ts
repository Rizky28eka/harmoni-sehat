import { z } from 'zod';

export const createClinicSchema = z.object({
  nama: z.string().min(1, 'Nama klinik tidak boleh kosong').trim(),
  alamat: z.string().min(1, 'Alamat tidak boleh kosong').trim(),
  no_telepon: z.string().min(1, 'Nomor telepon tidak boleh kosong').trim(),
  email: z.string().email('Email tidak valid').optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateClinicSchema = z.object({
  nama: z.string().min(1, 'Nama klinik tidak boleh kosong').trim().optional(),
  alamat: z.string().min(1, 'Alamat tidak boleh kosong').trim().optional(),
  no_telepon: z.string().min(1, 'Nomor telepon tidak boleh kosong').trim().optional(),
  email: z.string().email('Email tidak valid').optional(),
  status: z.enum(['active', 'inactive']).optional(),
});