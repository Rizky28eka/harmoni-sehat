import { Schema, model, Document, Types } from 'mongoose';

export interface IDrugOrderDetail extends Document {
  pesanan_id: Types.ObjectId;
  obat_id: Types.ObjectId;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const DrugOrderDetailSchema = new Schema<IDrugOrderDetail>({
  pesanan_id: {
    type: Schema.Types.ObjectId,
    ref: 'DrugOrder',
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
  harga_satuan: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

const DrugOrderDetail = model<IDrugOrderDetail>('DrugOrderDetail', DrugOrderDetailSchema);

export default DrugOrderDetail;