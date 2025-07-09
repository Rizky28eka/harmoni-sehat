import { Schema, model, Document, Types } from 'mongoose';

export interface IPatient extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  nama: string;
  nik: string;
  tanggal_lahir: Date;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
  no_telepon: string;
}

const patientSchema = new Schema<IPatient>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nama: {
    type: String,
    required: true,
    trim: true,
  },
  nik: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  tanggal_lahir: {
    type: Date,
    required: true,
  },
  jenis_kelamin: {
    type: String,
    enum: ['Laki-laki', 'Perempuan'],
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
  no_telepon: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

const Patient = model<IPatient>('Patient', patientSchema);

export default Patient;
