import { Schema, model, Document, Types } from 'mongoose';
import { ownerScope } from '../plugins/ownerScope';
import { userOwnedScope } from './scopes';

export interface IMedicationReminder extends Document {
  user_id: Types.ObjectId;
  nama_obat: string;
  dosis?: string;
  jam: string[]; // HH:mm (WIB)
  tanggal_mulai: Date;
  tanggal_selesai?: Date;
  catatan?: string;
  resep_id?: Types.ObjectId;
  is_active: boolean;
}

const MedicationReminderSchema = new Schema<IMedicationReminder>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    nama_obat: { type: String, required: true, trim: true, maxlength: 120 },
    dosis: { type: String, trim: true, maxlength: 80 },
    jam: { type: [String], validate: (v: string[]) => v.length > 0 && v.every((t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t)) },
    tanggal_mulai: { type: Date, default: Date.now },
    tanggal_selesai: { type: Date },
    catatan: { type: String, trim: true, maxlength: 300 },
    resep_id: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ownerScope(MedicationReminderSchema, userOwnedScope('user_id'));

export default model<IMedicationReminder>('MedicationReminder', MedicationReminderSchema);
