import { Schema, model, Document, Types } from 'mongoose';

export interface IPrescriptionDrug extends Document {
  resep_id: Types.ObjectId;
  obat_id: Types.ObjectId;
  dosis: string;
  jumlah: number;
  aturan_pakai: string;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionDrugSchema = new Schema<IPrescriptionDrug>({
  resep_id: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true,
  },
  obat_id: {
    type: Schema.Types.ObjectId,
    ref: 'Drug',
    required: true,
  },
  dosis: {
    type: String,
    required: true,
    trim: true,
  },
  jumlah: {
    type: Number,
    required: true,
    min: 1,
  },
  aturan_pakai: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const PrescriptionDrug = model<IPrescriptionDrug>('PrescriptionDrug', PrescriptionDrugSchema);

export default PrescriptionDrug;