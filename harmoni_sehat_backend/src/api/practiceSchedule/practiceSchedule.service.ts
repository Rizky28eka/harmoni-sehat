import PracticeSchedule, { IPracticeSchedule } from '../../models/PracticeSchedule';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreatePracticeScheduleInput, UpdatePracticeScheduleInput } from './practiceSchedule.validation';
import Doctor from '../../models/Doctor';
import Clinic from '../../models/Clinic';

class PracticeScheduleService {
  async createPracticeSchedule(doctorUserId: string, scheduleData: CreatePracticeScheduleInput): Promise<IPracticeSchedule> {
    // Check if doctor exists and matches the user
    const doctor = await Doctor.findOne({ user_id: doctorUserId });
    if (!doctor || doctor._id.toString() !== scheduleData.doctor_id) {
      throw new AppError('Doctor not found or unauthorized to create schedule for this doctor ID', 403);
    }

    // Check if clinic exists
    const clinic = await Clinic.findById(scheduleData.clinic_id);
    if (!clinic) {
      throw new AppError('Clinic not found', 404);
    }

    const newSchedule = await PracticeSchedule.create(scheduleData);
    return newSchedule;
  }

  async getAllPracticeSchedules(): Promise<IPracticeSchedule[]> {
    return PracticeSchedule.find().populate('doctor_id').populate('clinic_id');
  }

  async getPracticeScheduleById(scheduleId: string): Promise<IPracticeSchedule | null> {
    if (!Types.ObjectId.isValid(scheduleId)) {
      throw new AppError('Invalid Practice Schedule ID', 400);
    }
    const schedule = await PracticeSchedule.findById(scheduleId).populate('doctor_id').populate('clinic_id');
    if (!schedule) {
      throw new AppError('Practice Schedule not found', 404);
    }
    return schedule;
  }

  async getDoctorPracticeSchedules(doctorUserId: string): Promise<IPracticeSchedule[]> {
    const doctor = await Doctor.findOne({ user_id: doctorUserId });
    if (!doctor) {
      throw new AppError('Doctor profile not found for this user', 404);
    }
    return PracticeSchedule.find({ doctor_id: doctor._id }).populate('doctor_id').populate('clinic_id');
  }

  async updatePracticeSchedule(scheduleId: string, scheduleData: UpdatePracticeScheduleInput): Promise<IPracticeSchedule | null> {
    if (!Types.ObjectId.isValid(scheduleId)) {
      throw new AppError('Invalid Practice Schedule ID', 400);
    }
    const schedule = await PracticeSchedule.findByIdAndUpdate(scheduleId, scheduleData, { new: true, runValidators: true });
    if (!schedule) {
      throw new AppError('Practice Schedule not found', 404);
    }
    return schedule;
  }

  async deletePracticeSchedule(scheduleId: string): Promise<void> {
    if (!Types.ObjectId.isValid(scheduleId)) {
      throw new AppError('Invalid Practice Schedule ID', 400);
    }
    const schedule = await PracticeSchedule.findByIdAndDelete(scheduleId);
    if (!schedule) {
      throw new AppError('Practice Schedule not found', 404);
    }
  }
}

export default new PracticeScheduleService();
