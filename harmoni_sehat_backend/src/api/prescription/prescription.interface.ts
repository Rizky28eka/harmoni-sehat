import { Types } from 'mongoose';
import { IPrescription } from '../../models/Prescription';

export interface CreatePrescriptionDto {
  consultation_id: string; // Will be ObjectId in service
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
  consultation_id: string;
  catatan?: string;
  status: 'active' | 'inactive' | 'expired';
  expired_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const toPrescriptionResponseDto = (prescription: IPrescription): IPrescriptionResponseDto => {
  return {
    id: prescription._id.toString(),
    consultation_id: prescription.consultation_id.toString(),
    catatan: prescription.catatan,
    status: prescription.status,
    expired_at: prescription.expired_at,
    createdAt: prescription.createdAt,
    updatedAt: prescription.updatedAt,
  };
};
