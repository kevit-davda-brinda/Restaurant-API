import mongoose, { Schema, Document } from 'mongoose';

export interface InvoiceDocument extends Document {
  invoiceId: string;
  products: Array<ProductInfo>;
  createdAt: Date;
  isDeleted: boolean;
}

export interface ProductInfo {
  
  productCode: string;
  productName: string;
  createdAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  invoiceId: { type: String, required: true },
  products: [
    {}
  ],
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});


export default mongoose.model<InvoiceDocument>('Invoice', InvoiceSchema);