import { Schema, model, Document, Types } from 'mongoose';
import { generateCustomId } from '../utils/idGenerator';

export interface IAdmin extends Document {
  _id: string; // Custom ID
  user_id: Types.ObjectId;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  _id: {
    type: String,
    default: () => generateCustomId('04', 12), // Admin ID starts with 04
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
}, { _id: false, timestamps: true }); // Disable default _id generation

const Admin = model<IAdmin>('Admin', AdminSchema);

export default Admin;