import { Schema, model, Document, Types } from 'mongoose';

export interface IDrugCart extends Document {
  _id: Types.ObjectId;
  patient_id: Types.ObjectId;
  drug_id: Types.ObjectId;
  jumlah: number;
  createdAt: Date;
  updatedAt: Date;
}

const drugCartSchema = new Schema<IDrugCart>({
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  drug_id: {
    type: Schema.Types.ObjectId,
    ref: 'Drug',
    required: true,
  },
  jumlah: {
    type: Number,
    required: true,
    min: 1,
  },
},
{
  timestamps: true,
});

drugCartSchema.index({ patient_id: 1, drug_id: 1 }, { unique: true });

const DrugCart = model<IDrugCart>('DrugCart', drugCartSchema);

export default DrugCart;
