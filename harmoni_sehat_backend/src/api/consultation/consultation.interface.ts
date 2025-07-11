
import { Document, Types } from 'mongoose';
import { IConsultation as IConsultationModel } from '../../models/Consultation';

export interface CreateConsultationDto {
  pasien_id: Types.ObjectId; // Will be ObjectId in service
  dokter_id: Types.ObjectId; // Will be ObjectId in service
  jadwal_id: Types.ObjectId; // Will be ObjectId in service
  tanggal: Date;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  keluhan: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
}

export interface UpdateConsultationDto {
  pasien_id?: Types.ObjectId;
  dokter_id?: Types.ObjectId;
  jadwal_id?: Types.ObjectId;
  tanggal?: Date;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  keluhan?: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
}

export interface IConsultationResponseDto {
  id: string;
  pasien_id: string;
  dokter_id: string;
  jadwal_id: string;
  tanggal: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  keluhan: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
}

export const toConsultationResponseDto = (consultation: IConsultationModel): IConsultationResponseDto => ({
  id: (consultation._id as Types.ObjectId).toString(),
  pasien_id: (consultation.pasien_id as Types.ObjectId).toString(),
  dokter_id: (consultation.dokter_id as Types.ObjectId).toString(),
  jadwal_id: (consultation.jadwal_id as Types.ObjectId).toString(),
  tanggal: consultation.tanggal,
  status: consultation.status,
  keluhan: consultation.keluhan,
  diagnosa: consultation.diagnosa,
  tindakan: consultation.tindakan,
  catatan_dokter: consultation.catatan_dokter,
  video_call_url: consultation.video_call_url,
});
