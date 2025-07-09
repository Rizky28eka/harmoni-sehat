import { Schema, model, Document, Types } from 'mongoose';

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  nama: string;
}

const adminSchema = new Schema<IAdmin>({
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
},
{
  timestamps: true,
});

const Admin = model<IAdmin>('Admin', adminSchema);

export default Admin;
