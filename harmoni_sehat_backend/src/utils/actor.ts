import { Request } from 'express';
import Pasien from '../models/Pasien';
import Dokter from '../models/Dokter';
import Apoteker from '../models/Apoteker';
import { AppError } from './AppError';

export interface Actor {
  userId: string;
  role: string;
  isAdmin: boolean;
  /** Pasien / Dokter / Apoteker custom id, depending on role */
  profileId?: string;
}

/** Resolve the authenticated caller (requires `protect` to have run). */
export const getActor = async (req: Request): Promise<Actor> => {
  const user = (req as any).user;
  const role = (req as any).userRole as string;
  if (!user || !role) throw new AppError('Not authenticated', 401);
  return actorFromUser(user, role);
};

export const actorFromUser = async (user: { _id: any }, role: string): Promise<Actor> => {
  const actor: Actor = {
    userId: String(user._id),
    role,
    isAdmin: role === 'admin' || role === 'superadmin',
  };

  if (role === 'pasien') {
    actor.profileId = (await Pasien.findOne({ user_id: user._id }).select('_id'))?._id;
  } else if (role === 'dokter') {
    actor.profileId = (await Dokter.findOne({ user_id: user._id }).select('_id'))?._id;
  } else if (role === 'farmasi') {
    actor.profileId = (await Apoteker.findOne({ user_id: user._id }).select('_id'))?._id;
  }
  return actor;
};

export const forbidden = () => new AppError('You do not have access to this resource', 403);
