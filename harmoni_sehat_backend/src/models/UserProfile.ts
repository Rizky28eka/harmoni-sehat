import { Schema, model, Document, Types } from 'mongoose';

export interface IUserProfile extends Document {
  user_id: Types.ObjectId;
  foto?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  foto: {
    type: String,
  },
  bio: {
    type: String,
  },
  
}, { timestamps: true });

const UserProfile = model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfile;