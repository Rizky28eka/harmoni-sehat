import { Schema, model, Document, Types } from 'mongoose';

export interface IPharmacist extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  nama: string;
  nomor_sipa: string;
  createdAt: Date;
  updatedAt: Date;
}

const pharmacistSchema = new Schema<IPharmacist>({
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
  nomor_sipa: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
},
{
  timestamps: true,
});

const Pharmacist = model<IPharmacist>('Pharmacist', pharmacistSchema);

export default Pharmacist;
