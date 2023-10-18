import mongoose, { Schema, Document } from 'mongoose';
import { I_Product } from './product';

export interface InvoiceDocument extends Document {
  products: Array<I_Product>;
  isDeleted: boolean;
}

export interface ProductInfo {
  productId: Object;
  productCode: string;
  productName: string;
  createdAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  products: [
    {
      type: Object,
      ref: 'Product'
    }
  ],
  isDeleted: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  });


export default mongoose.model<InvoiceDocument>('Invoice', InvoiceSchema);