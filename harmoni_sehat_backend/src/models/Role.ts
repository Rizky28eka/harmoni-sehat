import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  nama_peran: string;
}

const RoleSchema = new Schema<IRole>({
  nama_peran: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Role = model<IRole>('Role', RoleSchema);

export default Role;