import Consultation, { IConsultation } from '../../models/Consultation';
import { AppError } from '../../utils/AppError';

class ConsultationService {
  async createConsultation(data: Partial<IConsultation>): Promise<IConsultation> {
    const consultation = await Consultation.create(data);
    return consultation;
  }

  async getAllConsultations(): Promise<IConsultation[]> {
    const consultations = await Consultation.find()
      .populate('pasien_id')
      .populate('dokter_id')
      .populate('jadwal_id');
    return consultations;
  }

  async getConsultationById(id: string): Promise<IConsultation> {
    const consultation = await Consultation.findById(id)
      .populate('pasien_id')
      .populate('dokter_id')
      .populate('jadwal_id');
    if (!consultation) {
      throw new AppError('Konsultasi tidak ditemukan', 404);
    }
    return consultation;
  }

  async updateConsultation(id: string, data: Partial<IConsultation>): Promise<IConsultation> {
    const consultation = await Consultation.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!consultation) {
      throw new AppError('Konsultasi tidak ditemukan', 404);
    }
    return consultation;
  }

  async deleteConsultation(id: string): Promise<void> {
    const consultation = await Consultation.findByIdAndDelete(id);
    if (!consultation) {
      throw new AppError('Konsultasi tidak ditemukan', 404);
    }
  }
}

export default new ConsultationService();