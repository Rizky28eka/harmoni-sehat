import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctorReview extends Document {
  _id: Types.ObjectId;
  patient_id: Types.ObjectId;
  doctor_id: Types.ObjectId;
  consultation_id: Types.ObjectId;
  rating: number;
  komentar?: string;
}

const doctorReviewSchema = new Schema<IDoctorReview>({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  consultation_id: {
    type: Schema.Types.ObjectId,
    ref: 'Consultation',
    required: true,
    unique: true, // One review per consultation
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  komentar: {
    type: String,
  },
},
{
  timestamps: true,
});

const DoctorReview = model<IDoctorReview>('DoctorReview', doctorReviewSchema);

export default DoctorReview;
