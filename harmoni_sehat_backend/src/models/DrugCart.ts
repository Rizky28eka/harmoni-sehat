import { Schema, model, Document, Types } from 'mongoose';

export interface IDrugCart extends Document {
  pasien_id: string; // Refers to Pasien's custom _id
  obat_id: Types.ObjectId;
  jumlah: number;
  createdAt: Date;
  updatedAt: Date;
}

const DrugCartSchema = new Schema<IDrugCart>({
  pasien_id: {
    type: String,
    ref: 'Pasien',
    required: true,
  },
  obat_id: {
    type: Schema.Types.ObjectId,
    ref: 'Drug',
    required: true,
  },
  jumlah: {
    type: Number,
    required: true,
    min: 1,
  },
}, { timestamps: true });

const DrugCart = model<IDrugCart>('DrugCart', DrugCartSchema);

export default DrugCart;