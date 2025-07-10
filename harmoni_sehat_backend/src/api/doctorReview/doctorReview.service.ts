import DoctorReview, { IDoctorReview } from '../../models/DoctorReview';
import { AppError } from '../../utils/AppError';

class DoctorReviewService {
  async createDoctorReview(data: Partial<IDoctorReview>): Promise<IDoctorReview> {
    const existingReview = await DoctorReview.findOne({ konsultasi_id: data.konsultasi_id });
    if (existingReview) {
      throw new AppError('Review untuk konsultasi ini sudah ada', 409);
    }
    const doctorReview = await DoctorReview.create(data);
    return doctorReview;
  }

  async getAllDoctorReviews(): Promise<IDoctorReview[]> {
    const doctorReviews = await DoctorReview.find()
      .populate('pasien_id')
      .populate('dokter_id')
      .populate('konsultasi_id');
    return doctorReviews;
  }

  async getDoctorReviewById(id: string): Promise<IDoctorReview> {
    const doctorReview = await DoctorReview.findById(id)
      .populate('pasien_id')
      .populate('dokter_id')
      .populate('konsultasi_id');
    if (!doctorReview) {
      throw new AppError('Review dokter tidak ditemukan', 404);
    }
    return doctorReview;
  }

  async updateDoctorReview(id: string, data: Partial<IDoctorReview>): Promise<IDoctorReview> {
    const doctorReview = await DoctorReview.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!doctorReview) {
      throw new AppError('Review dokter tidak ditemukan', 404);
    }
    return doctorReview;
  }

  async deleteDoctorReview(id: string): Promise<void> {
    const doctorReview = await DoctorReview.findByIdAndDelete(id);
    if (!doctorReview) {
      throw new AppError('Review dokter tidak ditemukan', 404);
    }
  }
}

export default new DoctorReviewService();