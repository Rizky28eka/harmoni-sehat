import PracticeSchedule, { IPracticeSchedule } from '../../models/PracticeSchedule';
import { AppError } from '../../utils/AppError';

class PracticeScheduleService {
  async createPracticeSchedule(data: Partial<IPracticeSchedule>): Promise<IPracticeSchedule> {
    const existingSchedule = await PracticeSchedule.findOne({
      dokter_id: data.dokter_id,
      klinik_id: data.klinik_id,
      hari: data.hari,
      jam_mulai: data.jam_mulai,
      jam_selesai: data.jam_selesai,
    });
    if (existingSchedule) {
      throw new AppError('Jadwal praktik sudah ada', 409);
    }
    const practiceSchedule = await PracticeSchedule.create(data);
    return practiceSchedule;
  }

  async getAllPracticeSchedules(): Promise<IPracticeSchedule[]> {
    const practiceSchedules = await PracticeSchedule.find().populate('dokter_id').populate('klinik_id');
    return practiceSchedules;
  }

  async getPracticeScheduleById(id: string): Promise<IPracticeSchedule> {
    const practiceSchedule = await PracticeSchedule.findById(id).populate('dokter_id').populate('klinik_id');
    if (!practiceSchedule) {
      throw new AppError('Jadwal praktik tidak ditemukan', 404);
    }
    return practiceSchedule;
  }

  async updatePracticeSchedule(id: string, data: Partial<IPracticeSchedule>): Promise<IPracticeSchedule> {
    const practiceSchedule = await PracticeSchedule.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!practiceSchedule) {
      throw new AppError('Jadwal praktik tidak ditemukan', 404);
    }
    return practiceSchedule;
  }

  async deletePracticeSchedule(id: string): Promise<void> {
    const practiceSchedule = await PracticeSchedule.findByIdAndDelete(id);
    if (!practiceSchedule) {
      throw new AppError('Jadwal praktik tidak ditemukan', 404);
    }
  }
}

export default new PracticeScheduleService();