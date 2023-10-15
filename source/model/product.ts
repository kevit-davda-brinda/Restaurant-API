import mongoose, { Schema, Document, model } from 'mongoose';

// Product Schema
export interface I_Product extends Document{
    readonly productCode: string;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
    // Add other product details here
  }
  
export const productSchema = new Schema<I_Product>({
    productCode: {
      type : String,
      required : true,
      unique : true,
    },
    name: {
      type : String,
      required : true,
    },
    description: String,
    price: Number,
    createdAt: Date,
    // Add other product details as needed
  });

  export const ProductModel = model<I_Product>('Product' , productSchema);

