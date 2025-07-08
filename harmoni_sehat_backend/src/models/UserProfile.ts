import mongoose, { Schema } from 'mongoose';
import { IUserProfile, IUserProfileModel } from '../types';

const UserProfileSchema = new Schema<IUserProfile, IUserProfileModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    nama: {
        type: String,
        required: true,
    },
    tanggal_lahir: {
        type: Date,
    },
    jenis_kelamin: {
        type: String,
        enum: ['Laki-laki', 'Perempuan'],
    },
    alamat: {
        type: String,
    },
    nomor_telepon: {
        type: String,
    },
    foto: {
        type: String, // URL to the photo
    },
    bio: {
        type: String,
    },
}, { timestamps: true });

const UserProfile = mongoose.model<IUserProfile, IUserProfileModel>('UserProfile', UserProfileSchema);

export default UserProfile;