import { Schema, model, Document, Types } from 'mongoose';

export interface IDrugOrderDetail extends Document {
  _id: Types.ObjectId;
  order_id: Types.ObjectId;
  drug_id: Types.ObjectId;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const drugOrderDetailSchema = new Schema<IDrugOrderDetail>({
  order_id: {
    type: Schema.Types.ObjectId,
    ref: 'DrugOrder',
    required: true,
  },
  drug_id: {
    type: Schema.Types.ObjectId,
    ref: 'Drug',
    required: true,
  },
  harga_satuan: {
    type: Number,
    required: true,
    min: 0,
  },
  jumlah: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
},
{
  timestamps: true,
});

const DrugOrderDetail = model<IDrugOrderDetail>('DrugOrderDetail', drugOrderDetailSchema);

export default DrugOrderDetail;
