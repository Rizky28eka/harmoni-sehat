import { Request, Response, NextFunction } from 'express';
import Dokter from '../models/Dokter';
import Apoteker from '../models/Apoteker';
import { AppError } from '../utils/AppError';
import { asSystem } from '../utils/requestContext';

const WRITE = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Doctors/pharmacists may only perform write operations once an admin verified their licence. */
export const requireVerifiedProfessional = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!WRITE.has(req.method)) return next();
    const role = (req as any).userRole as string;
    const userId = (req as any).user?._id;
    if (role === 'dokter') {
      const d = await asSystem(() => Dokter.findOne({ user_id: userId }).select('is_verified'));
      if (!d?.is_verified) throw new AppError('Akun dokter belum terverifikasi', 403);
    } else if (role === 'farmasi') {
      const a = await asSystem(() => Apoteker.findOne({ user_id: userId }).select('is_verified'));
      if (!a?.is_verified) throw new AppError('Akun apoteker belum terverifikasi', 403);
    }
    next();
  } catch (e) {
    next(e);
  }
};
