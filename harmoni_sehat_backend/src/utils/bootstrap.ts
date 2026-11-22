import Role from '../models/Role';

export const ROLES = ['pasien', 'dokter', 'farmasi', 'admin', 'superadmin'] as const;
export type RoleName = (typeof ROLES)[number];

/** Make sure every role used by authorization exists (idempotent). */
export const ensureRoles = async () => {
  for (const nama_peran of ROLES) {
    await Role.updateOne({ nama_peran }, { $setOnInsert: { nama_peran } }, { upsert: true });
  }
};
