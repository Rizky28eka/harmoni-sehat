import { Schema, model, Document, Types } from 'mongoose';

export interface IRole extends Document {
  _id: Types.ObjectId;
  nama_peran: string;
}

const roleSchema = new Schema<IRole>({
  nama_peran: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Role = model<IRole>('Role', roleSchema);

export default Role;
