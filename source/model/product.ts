import mongoose, { Schema, Document, model } from 'mongoose';
import invoice from './invoice';

// Product Schema
export interface I_Product extends Document{
    readonly productCode: string;
    name: string;
    description: string;
    price: number;
    invoice_id?: Object
    // Add other product details here
  }
  
export const productSchema = new Schema<I_Product>({
    productCode: {
      type : String,
      required : true,
      unique : true,
      immutable: true 
    },
    name: {
      type : String,
      required : true,
    },
    description: String,
    price: Number,
    invoice_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice"
    }
    // Add other product details as needed
  },
  {
    timestamps: true,
  }
);



  export const ProductModel = model<I_Product>('Product' , productSchema , "product");

