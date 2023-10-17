import { I_Product as Product, ProductModel } from "../model/product";

// Create a new product
export async function createProduct(productData: Product): Promise<Product | String> {
    try {
        const product = new ProductModel(productData);

        const productCode  = productData.productCode;

        if (productCode) {
            const product = await ProductModel.findOne( { productCode } );

            if(product){
                return 'Product already available';
            }
        }

        // ProductModel.find({}).populate();

        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error; // Rethrow the error to handle it at the calling site
    }
}

// Update a product
export async function updateProduct(productCode: string, updatedData: Partial<Product>): Promise<Product | String> {
    const output = await ProductModel.findOneAndUpdate({ productCode }, updatedData, { new: true });

    if (output == null) {
        return 'ProductCode is not valid';
    }

    return output;
}

// Delete a product by product code
export async function deleteProduct(productCode: string) {
    try {
        const findProduct = await ProductModel.find({ productCode })

        if (findProduct.length == 0) {
            return 'Please provide correct Product Code';
        }

        await ProductModel.findOneAndDelete(findProduct);
        return 'Product Deleted Successfully';
    }
    catch (e) {
        console.log(e)
    }
}

// Delete products by name (soft delete)
export async function deleteProductsByName(name: string) {
    try {
        const findProduct = await ProductModel.find({ name })

        if (findProduct.length == 0) {
            return 'Please provide correct Product name';
        }

        await ProductModel.findOneAndDelete(findProduct);
        return 'Product Deleted Successfully';
    }
    catch (e) {
        console.log(e)
    }
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

