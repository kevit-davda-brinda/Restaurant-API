import { Request, Response, Router } from 'express';
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
import { ProductModel } from '../model/product';

export const product_router = Router();

//set the product details 
product_router.post('/product', auth, async (req: Request, res: Response) => {
  try {
    const productData = req.body; // Make sure to validate and sanitize user input

    //if the req.body don't have data or empty object
    if (Object.keys(productData).length == 0) {
      return res.send('Please provide product details');
    }

    if (!productData.hasOwnProperty('productCode')) {
      return res.send('Please provide productCode');
    }

    const product = await createProduct(productData);

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ error });
  }
})

//delete a product by Product Code
product_router.delete('/product/:productCode', auth, async (req: Request, res: Response) => {
  try {
    const { productCode } = req.params;

    const output = await deleteProduct(productCode);
    res.json({ message: output });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

//delete a product by product name
product_router.delete('/product/deleteByName/:name', auth, async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const output = await deleteProductsByName(name);
    res.json({ message: output });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete products by name' });
  }
});

//edit product 
product_router.patch('/product/:productCode', auth, async (req: Request, res: Response) => {
  try {
    const { productCode } = req.params;

    if (Object.keys(req.body).length == 0) {
      return res.send('Please provide the data');
    }

    const output = await updateProduct(productCode, req.body);
    res.json({ message: output });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
})

//filter data by created at filed == Remaining
// product_router.get('/product' , auth ,async(req:Request , res: Response)=>{

// })

//search product by it's name
product_router.get('/product/:name', auth, async (req: Request, res: Response) => {
  const output = await searchProductsByName(req.params.name);

  if (output.length == 0) {
    return res.send('Product not available');
  }

  return res.send({ message: output });

})

//listing the product
product_router.get('/product', auth, async (req: Request, res: Response) => {
  const output = await listProducts();

  const find = await ProductModel.findOne({});

  console.log(find);
  return res.send({ message: output });
})


