import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password?: string; // Password can be optional for DTOs, but required for creation
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false, // Do not return password by default
  },
  is_active: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps: true,
});

const User = model<IUser>('User', userSchema);

export default User;
