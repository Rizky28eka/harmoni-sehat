import mongoose from 'mongoose';
import { OwnerScopeConfig } from '../plugins/ownerScope';
import { Actor } from '../utils/actor';
import { asSystem } from '../utils/requestContext';

/**
 * Row-level access rules, one per sensitive collection.
 * `null` = no access for that role; `{}` = unrestricted for that role.
 */

const ids = async (modelName: string, filter: Record<string, any>, field: string): Promise<any[]> =>
  asSystem(async () => mongoose.model(modelName).distinct(field, filter));

export const consultationScope: OwnerScopeConfig = {
  scope: (a) =>
    a.role === 'pasien' && a.profileId ? { pasien_id: a.profileId }
    : a.role === 'dokter' && a.profileId ? { dokter_id: a.profileId }
    : null,
  force: (a) => (a.role === 'pasien' && a.profileId ? { pasien_id: a.profileId } : null),
};

export const medicalRecordScope: OwnerScopeConfig = {
  scope: (a, op) =>
    a.role === 'pasien' && a.profileId ? (op === 'read' ? { pasien_id: a.profileId } : null)
    : a.role === 'dokter' && a.profileId ? { dokter_id: a.profileId }
    : null,
  force: (a) => (a.role === 'dokter' && a.profileId ? { dokter_id: a.profileId } : null),
};

export const prescriptionScope: OwnerScopeConfig = {
  scope: (a, op) =>
    a.role === 'pasien' && a.profileId ? (op === 'read' ? { pasien_id: a.profileId } : null)
    : a.role === 'dokter' && a.profileId ? { dokter_id: a.profileId }
    : a.role === 'farmasi' ? (op === 'read' ? {} : null)
    : null,
  force: (a) => (a.role === 'dokter' && a.profileId ? { dokter_id: a.profileId } : null),
};

export const drugOrderScope: OwnerScopeConfig = {
  scope: (a) =>
    a.role === 'pasien' && a.profileId ? { pasien_id: a.profileId }
    : a.role === 'farmasi' ? {}
    : null,
  force: (a) => (a.role === 'pasien' && a.profileId ? { pasien_id: a.profileId } : null),
};

export const drugOrderDetailScope: OwnerScopeConfig = {
  scope: async (a) => {
    if (a.role === 'farmasi') return {};
    if (a.role === 'pasien' && a.profileId) {
      return { pesanan_id: { $in: await ids('DrugOrder', { pasien_id: a.profileId }, '_id') } };
    }
    return null;
  },
};

export const drugCartScope: OwnerScopeConfig = {
  scope: (a) => (a.role === 'pasien' && a.profileId ? { pasien_id: a.profileId } : null),
  force: (a) => (a.role === 'pasien' && a.profileId ? { pasien_id: a.profileId } : null),
};

export const userOwnedScope = (field: string): OwnerScopeConfig => ({
  scope: (a) => ({ [field]: a.userId }),
  force: (a) => ({ [field]: a.userId }),
});

export const chatMessageScope: OwnerScopeConfig = {
  scope: async (a) => {
    if (!a.profileId) return null;
    const field = a.role === 'pasien' ? 'pasien_id' : a.role === 'dokter' ? 'dokter_id' : null;
    if (!field) return null;
    return { konsultasi_id: { $in: await ids('Consultation', { [field]: a.profileId }, '_id') } };
  },
  force: (a) => ({ pengirim_id: a.userId }),
};

export const mediaScope: OwnerScopeConfig = {
  scope: (_a, op) => (op === 'read' ? {} : null),
  force: (a) => ({ uploaded_by: a.userId }),
};

export const mediaWriteOwnScope: OwnerScopeConfig = {
  scope: (a, op) => (op === 'read' ? {} : { uploaded_by: a.userId }),
  force: (a) => ({ uploaded_by: a.userId }),
};

export const reviewScope: OwnerScopeConfig = {
  scope: (a, op) =>
    op === 'read' ? {}
    : a.role === 'pasien' && a.profileId ? { pasien_id: a.profileId }
    : a.role === 'dokter' && a.profileId ? { dokter_id: a.profileId }
    : null,
  force: (a) => (a.role === 'pasien' && a.profileId ? { pasien_id: a.profileId } : null),
};

export const pasienScope: OwnerScopeConfig = {
  scope: async (a) => {
    if (a.role === 'pasien') return { user_id: a.userId };
    if (a.role === 'dokter' && a.profileId) {
      return { _id: { $in: await ids('Consultation', { dokter_id: a.profileId }, 'pasien_id') } };
    }
    if (a.role === 'farmasi') {
      return { _id: { $in: await ids('DrugOrder', {}, 'pasien_id') } };
    }
    return null;
  },
};

export const dokterScope: OwnerScopeConfig = {
  // Everyone can read the doctor directory; only the doctor can modify their own profile.
  scope: (a, op) => (op === 'read' ? {} : a.role === 'dokter' ? { user_id: a.userId } : null),
};

export const apotekerScope: OwnerScopeConfig = {
  scope: (a) => (a.role === 'farmasi' ? { user_id: a.userId } : null),
};

export type { Actor };
