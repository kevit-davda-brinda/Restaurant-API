import { I_Product as Product, ProductModel } from "../model/product";

// Create a new product
export async function createProduct(productData: Product): Promise<Product> {
    try {
        const product = new ProductModel(productData);
        const savedProduct = await product.save();
        return savedProduct;
      } catch (error) {
        console.error('Error creating product:', error);
        throw error; // Rethrow the error to handle it at the calling site
      }
}

// Update a product
export async function updateProduct(productCode: string, updatedData: Partial<Product>): Promise<Product | null> {
    return await ProductModel.findOneAndUpdate({ productCode }, updatedData, { new: true });
}

// Delete a product by product code
export async function deleteProduct(productCode: string){
    try{
         ProductModel.deleteOne({ productCode }).then((data)=>{
           return data.deletedCount
         }).catch(console.error);
         
    }
   catch(e){
    console.log(e)
   }
}

// Delete products by name (soft delete)
export async function deleteProductsByName(name: string): Promise<void> {
    await ProductModel.updateMany({ name }, { $set: { isDeleted: true } });
}

// Filter products by created at
export async function filterProductsByCreatedAt(date: Date): Promise<Product[]> {
    return await ProductModel.find({ createdAt: { $gte: date } });
}

// Search products by name
export async function searchProductsByName(name: string): Promise<Product[]> {
    return await ProductModel.find({ name });
}

// List products with sorting by created at
export async function listProducts(): Promise<Product[]> {
    return await ProductModel.find().sort({ createdAt: -1 });
}

