import { Schema, model, Document, Types } from 'mongoose';

export interface IPrescriptionDrug extends Document {
  _id: Types.ObjectId;
  prescription_id: Types.ObjectId;
  drug_id: Types.ObjectId;
  dosis: string;
  jumlah: number;
  aturan_pakai: string;
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionDrugSchema = new Schema<IPrescriptionDrug>({
  prescription_id: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true,
  },
  drug_id: {
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
  },
},
{
  timestamps: true,
});

const PrescriptionDrug = model<IPrescriptionDrug>('PrescriptionDrug', prescriptionDrugSchema);

export default PrescriptionDrug;
