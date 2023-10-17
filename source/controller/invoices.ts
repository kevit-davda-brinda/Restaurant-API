import { Request, Response } from 'express';
import Invoice, { ProductInfo } from '../model/invoice';
import { I_Product, ProductModel } from '../model/product';

class InvoiceController {

    async createInvoice(req: Request, res: Response) {
        try {
            const { invoiceId, products } = req.body;
            // console.log(req.body);

            const new_Product : any[]  = []

            //find the product exists or not by name and product code
            products.forEach(async (product: ProductInfo) =>{
                const findProduct = await ProductModel.findOne({ productCode: product.productCode });
                if(findProduct){
                    findProduct.invoice_id = invoiceId;
                    // await ProductModel.updateOne();
                    new_Product.push(findProduct);
                }

                // console.log(new_Product);
            });


            //creating invoice object to save the invoice data
            // const newInvoice = new Invoice({ invoiceId, products : new_Product });

            // await newInvoice.save();

            return res.status(201).json({ message: 'Invoice created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating invoice' });
        }
    }

    async editInvoice(req: Request, res: Response) {
        try {
            const { invoiceId, ...updates } = req.body;
            const existingInvoice = await Invoice.findOne({ invoiceId });

            if (!existingInvoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }

            //finding the product that wants to update
            const index = existingInvoice.products.findIndex((product) => product.productCode === updates.productCode);

            if (index === -1) {
                return res.send('Provide correct Product Code');
            }

            existingInvoice.products[index] = updates;

            //saving it
            await existingInvoice.updateOne();

            return res.status(200).json({ message: 'Invoice updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error editing invoice' });
        }
    }
    async deleteInvoice(req: Request, res: Response) {
        try {
            const { invoiceId } = req.params;
            const deletedInvoice = await Invoice.findOneAndUpdate({ invoiceId }, { isDeleted: true }, { new: true });
            if (!deletedInvoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
            return res.status(200).json({ message: 'Invoice deleted (soft deletion)' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting invoice' });
        }
    }
    async viewInvoice(req: Request, res: Response) {
        try {
            const { invoiceId } = req.params;
            const invoice = await Invoice.findOne({ invoiceId });
            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
            return res.status(200).json(invoice);
        } catch (error) {
            return res.status(500).json({ message: 'Error viewing invoice' });
        }
    }
    // Implement other invoice management methods as needed
}
export default InvoiceController;