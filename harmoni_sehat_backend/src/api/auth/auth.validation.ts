import { z } from 'zod';

const password = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
  .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
  .regex(/\d/, 'Password harus mengandung angka')
  .regex(/[@$!%*?&]/, 'Password harus mengandung karakter spesial (@$!%*?&)');

export const registerSchema = z.object({
  body: z
    .object({
      email: z.string().email('Email tidak valid'),
      password,
      role: z.enum(['pasien', 'dokter', 'farmasi', 'apoteker'], {
        message: 'Role tidak valid',
      }),
      name: z.string().min(1, 'Nama wajib diisi'),
      nik: z.string().length(16, 'NIK harus 16 digit').optional(),
      tanggal_lahir: z.string().optional(),
      jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
      alamat: z.string().optional(),
      no_telepon: z.string().optional(),
      nomor_str: z.string().optional(),
      spesialisasi_id: z.string().optional(),
      biaya_konsultasi: z.coerce.number().min(0).optional(),
      foto: z.string().optional(),
      bio: z.string().optional(),
      nomor_sipa: z.string().optional(),
    })
    .superRefine((v, ctx) => {
      const need = (cond: unknown, path: string, msg: string) => {
        if (!cond) ctx.addIssue({ code: 'custom', path: [path], message: msg });
      };
      if (v.role === 'pasien') {
        need(v.nik, 'nik', 'NIK wajib diisi');
        need(v.tanggal_lahir, 'tanggal_lahir', 'Tanggal lahir wajib diisi');
        need(v.jenis_kelamin, 'jenis_kelamin', 'Jenis kelamin wajib diisi');
        need(v.alamat, 'alamat', 'Alamat wajib diisi');
        need(v.no_telepon, 'no_telepon', 'Nomor telepon wajib diisi');
      } else if (v.role === 'dokter') {
        need(v.nomor_str, 'nomor_str', 'Nomor STR wajib diisi');
      } else {
        need(v.nomor_sipa, 'nomor_sipa', 'Nomor SIPA wajib diisi');
      }
    }),
});

export const loginSchema = z.object({
  body: z.object({ email: z.string().email('Email tidak valid'), password: z.string().min(1) }),
});

export const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string().min(10, 'refreshToken wajib diisi') }),
});

export const forgotSchema = z.object({ body: z.object({ email: z.string().email() }) });
export const verifyResetSchema = z.object({ body: z.object({ token: z.string().min(10) }) });
export const resetSchema = z.object({
  body: z.object({ token: z.string().min(10), newPassword: password }),
});
export const changePasswordSchema = z.object({
  body: z.object({ currentPassword: z.string().min(1), newPassword: password }),
});
