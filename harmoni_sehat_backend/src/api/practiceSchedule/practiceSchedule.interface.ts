
import { Types } from 'mongoose';
import { IPracticeSchedule } from '../../models/PracticeSchedule';

export interface CreatePracticeScheduleDto {
  dokter_id: Types.ObjectId; // Will be ObjectId in service
  klinik_id: Types.ObjectId; // Will be ObjectId in service
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  jam_mulai: string;
  jam_selesai: string;
  is_active?: boolean;
}

export interface UpdatePracticeScheduleDto {
  dokter_id?: Types.ObjectId;
  klinik_id?: Types.ObjectId;
  hari?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  jam_mulai?: string;
  jam_selesai?: string;
  is_active?: boolean;
}



export interface IPracticeScheduleResponseDto {
  id: string;
  dokter_id: string;
  klinik_id: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  is_active: boolean;
}

export const toPracticeScheduleResponseDto = (schedule: IPracticeSchedule): IPracticeScheduleResponseDto => ({
  id: (schedule._id as Types.ObjectId).toString(),
  dokter_id: schedule.dokter_id.toString(),
  klinik_id: (schedule.klinik_id as Types.ObjectId).toString(),
  hari: schedule.hari,
  jam_mulai: schedule.jam_mulai,
  jam_selesai: schedule.jam_selesai,
  is_active: schedule.is_active,
});
