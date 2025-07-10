import { Schema, model, Document, Types } from 'mongoose';

export interface IUserRole extends Document {
  user_id: Types.ObjectId;
  peran_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserRoleSchema = new Schema<IUserRole>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  peran_id: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
}, { timestamps: true });

const UserRole = model<IUserRole>('UserRole', UserRoleSchema);

export default UserRole;
