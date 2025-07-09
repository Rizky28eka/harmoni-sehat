import { Schema, model, Document, Types } from 'mongoose';

export interface IUserRole extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  role_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userRoleSchema = new Schema<IUserRole>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role_id: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
},
{
  timestamps: true,
});

userRoleSchema.index({ user_id: 1, role_id: 1 }, { unique: true });

const UserRole = model<IUserRole>('UserRole', userRoleSchema);

export default UserRole;