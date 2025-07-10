import { Schema, model, Document, Types } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';

export interface IApoteker extends Document {
  _id: string; // Custom ID
  user_id: Types.ObjectId;
  nama: string;
  nomor_sipa: string;
}

const ApotekerSchema = new Schema<IApoteker>({
  _id: {
    type: String,
    default: () => generateCustomId('20', 12), // Apoteker ID starts with 20
  },
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
}, { _id: false }); // Disable default _id generation

const Apoteker = model<IApoteker>('Apoteker', ApotekerSchema);

export default Apoteker;
