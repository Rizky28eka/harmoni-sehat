import DoctorReview, { IDoctorReview } from '../../models/DoctorReview';
import Consultation from '../../models/Consultation'; // Import Consultation model
import { AppError } from '../../utils/AppError';
import { analyzeSentiment } from '../../api/gemini/gemini.service'; // Import analyzeSentiment

class DoctorReviewService {
  async createDoctorReview(data: Partial<IDoctorReview>): Promise<IDoctorReview> {
    // 1. Check if a review for this consultation already exists
    const existingReview = await DoctorReview.findOne({ konsultasi_id: data.konsultasi_id });
    if (existingReview) {
      throw new AppError('Review untuk konsultasi ini sudah ada', 409);
    }

    // 2. Verify that the consultation exists and is completed
    const consultation = await Consultation.findOne({
      _id: data.konsultasi_id,
      pasien_id: data.pasien_id,
      dokter_id: data.dokter_id,
      status: 'completed',
    });

    if (!consultation) {
      throw new AppError('Konsultasi tidak ditemukan atau belum selesai', 400);
    }

    // 3. Analyze sentiment if comment is provided
    if (data.komentar) {
      data.sentimen = await analyzeSentiment(data.komentar);
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
    // Analyze sentiment if comment is updated
    if (data.komentar) {
      data.sentimen = await analyzeSentiment(data.komentar);
    }
    const doctorReview = await DoctorReview.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!doctorReview) {
      throw new AppError('Review dokter tidak ditemukan', 404);
    }
    return doctorReview;
  }

  async replyToReview(reviewId: string, replyText: string): Promise<IDoctorReview> {
    const doctorReview = await DoctorReview.findByIdAndUpdate(
      reviewId,
      { balasan: replyText },
      { new: true, runValidators: true }
    );
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