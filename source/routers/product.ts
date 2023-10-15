import { Request, Response, Router } from 'express';
import { productSchema as Product, ProductModel } from '../model/product';
import { auth } from '../auth/auth';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductsByName,
    filterProductsByCreatedAt,
    searchProductsByName,
    listProducts,
} from '../controller/product';

export const product_router = Router();

//for testing purpose only
product_router.get('/product', (req: Request, res: Response) => {
    res.send('Product router is working');
})

//set the product details 
product_router.post('/product', auth, async (req: Request, res: Response) => {
    try {
        const productData = req.body; // Make sure to validate and sanitize user input

        //if the req.body don't have data or empty object
        if (Object.keys(productData).length == 0) {
            return res.send('Please provide product details');
        }

        const product = await createProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error });
    }
})

//delete a product by Product Code
product_router.delete('/product/delete/:productCode', async (req: Request, res: Response) => {
    try {
      const { productCode } = req.params;

      await deleteProduct(productCode);
      res.json({ message: 'Product deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

//delete a product by product name
product_router.delete('/deleteByName/:name', async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      await deleteProductsByName(name);
      res.json({ message: 'Products deleted by name' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete products by name' });
    }
  });


