import mongoose, { Schema } from 'mongoose';
import { IAdmin, IAdminModel } from '../types';

const AdminSchema = new Schema<IAdmin, IAdminModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
}, { timestamps: true });

const Admin = mongoose.model<IAdmin, IAdminModel>('Admin', AdminSchema);

export default Admin;