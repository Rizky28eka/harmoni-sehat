import { Schema, model, Document, Types } from 'mongoose';

export interface IUserProfile extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  foto?: string; // URL to photo
  bio?: string;
  updatedAt: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
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
},
{
  timestamps: { createdAt: false, updatedAt: true }, // Only track updatedAt
});

const UserProfile = model<IUserProfile>('UserProfile', userProfileSchema);

export default UserProfile;
