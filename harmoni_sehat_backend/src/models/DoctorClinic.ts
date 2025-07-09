import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctorClinic extends Document {
  _id: Types.ObjectId;
  doctor_id: Types.ObjectId;
  clinic_id: Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const doctorClinicSchema = new Schema<IDoctorClinic>({
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  clinic_id: {
    type: Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
},
{
  timestamps: true,
});

const DoctorClinic = model<IDoctorClinic>('DoctorClinic', doctorClinicSchema);

export default DoctorClinic;
