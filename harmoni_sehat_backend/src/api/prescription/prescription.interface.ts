
import { Types } from 'mongoose';
import { IPrescription } from '../../models/Prescription';

export interface CreatePrescriptionDto {
  konsultasi_id: Types.ObjectId; // Will be ObjectId in service
  catatan?: string;
  status?: 'active' | 'inactive' | 'expired';
  expired_at: Date;
}

export interface UpdatePrescriptionDto {
  catatan?: string;
  status?: 'active' | 'inactive' | 'expired';
  expired_at?: Date;
}



export interface IPrescriptionResponseDto {
  id: string;
  konsultasi_id: string;
  catatan?: string;
  status: 'active' | 'inactive' | 'expired';
  expired_at: Date;
}

export const toPrescriptionResponseDto = (prescription: IPrescription): IPrescriptionResponseDto => ({
  id: (prescription._id as Types.ObjectId).toString(),
  konsultasi_id: (prescription.konsultasi_id as Types.ObjectId).toString(),
  catatan: prescription.catatan,
  status: prescription.status,
  expired_at: prescription.expired_at,
});
