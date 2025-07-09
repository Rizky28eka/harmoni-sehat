import DoctorReview, { IDoctorReview } from '../../models/DoctorReview';
import AppError from '../../utils/AppError';
import { Types } from 'mongoose';
import { CreateDoctorReviewInput, UpdateDoctorReviewInput } from './doctorReview.validation';
import Patient from '../../models/Patient';
import Doctor from '../../models/Doctor';
import Consultation from '../../models/Consultation';

class DoctorReviewService {
  async createDoctorReview(userId: string, reviewData: CreateDoctorReviewInput): Promise<IDoctorReview> {
    // Check if patient exists and matches the user
    const patient = await Patient.findOne({ user_id: userId });
    if (!patient || patient._id.toString() !== reviewData.patient_id) {
      throw new AppError('Patient not found or unauthorized to create review for this patient ID', 403);
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(reviewData.doctor_id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Check if consultation exists and is completed
    const consultation = await Consultation.findById(reviewData.consultation_id);
    if (!consultation) {
      throw new AppError('Consultation not found', 404);
    }
    if (consultation.status !== 'completed') {
      throw new AppError('Review can only be created for completed consultations', 400);
    }

    // Check if a review already exists for this consultation
    const existingReview = await DoctorReview.findOne({ consultation_id: reviewData.consultation_id });
    if (existingReview) {
      throw new AppError('A review already exists for this consultation', 409);
    }

    const newReview = await DoctorReview.create(reviewData);
    return newReview;
  }

  async getAllDoctorReviews(): Promise<IDoctorReview[]> {
    return DoctorReview.find().populate('patient_id').populate('doctor_id').populate('consultation_id');
  }

  async getDoctorReviewsByDoctorId(doctorId: string): Promise<IDoctorReview[]> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new AppError('Invalid Doctor ID', 400);
    }
    return DoctorReview.find({ doctor_id: doctorId }).populate('patient_id').populate('consultation_id');
  }

  async getDoctorReviewById(reviewId: string): Promise<IDoctorReview | null> {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new AppError('Invalid Doctor Review ID', 400);
    }
    const review = await DoctorReview.findById(reviewId).populate('patient_id').populate('doctor_id').populate('consultation_id');
    if (!review) {
      throw new AppError('Doctor Review not found', 404);
    }
    return review;
  }

  async updateDoctorReview(reviewId: string, reviewData: UpdateDoctorReviewInput): Promise<IDoctorReview | null> {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new AppError('Invalid Doctor Review ID', 400);
    }
    const review = await DoctorReview.findByIdAndUpdate(reviewId, reviewData, { new: true, runValidators: true });
    if (!review) {
      throw new AppError('Doctor Review not found', 404);
    }
    return review;
  }

  async deleteDoctorReview(reviewId: string): Promise<void> {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new AppError('Invalid Doctor Review ID', 400);
    }
    const review = await DoctorReview.findByIdAndDelete(reviewId);
    if (!review) {
      throw new AppError('Doctor Review not found', 404);
    }
  }
}

export default new DoctorReviewService();
