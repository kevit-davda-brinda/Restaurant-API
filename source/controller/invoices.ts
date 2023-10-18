import { Request, Response } from 'express';
import Invoice from '../model/invoice';
import { I_Product, ProductModel } from '../model/product';


class InvoiceController {

    async createInvoice(req: Request, res: Response) {
        try {

            const invoice = new Invoice();

            invoice.products = [];

            const savedInvoice = await invoice.save();

            req.body.products.filter(async (product: I_Product) => {
                const findProduct = await ProductModel.findOne({ productCode: product.productCode });

                if (findProduct) {
                    await ProductModel.updateOne({ _id: findProduct.id }, { $set: { invoiceId: savedInvoice.id } });
                    await Invoice.findOneAndUpdate({ _id: savedInvoice.id }, { $push: { products: findProduct.id } }, { new: true });
                }
            });

            res.status(201).json(savedInvoice);
        } catch (error) {
            res.status(500).json({ error });
        }
    }


    async editInvoice(req: Request, res: Response) {

        const findInvoice = await Invoice.findById(req.params.id).populate('products', ['productCode', 'name', 'createdAt']);

        req.body.products.filter(async (product: I_Product) => {
            const findProduct = await ProductModel.findOne({ productCode: product.productCode });

            if (findProduct) {
                await ProductModel.updateOne({ _id: findProduct.id }, { $set: { invoiceId: findInvoice?.id } });
                await Invoice.findOneAndUpdate({ _id: findInvoice?.id }, { $push: { products: findProduct.id } }, { new: true });
            }
        });

        res.send(findInvoice);
    }

    // deleting invoices
    async deleteInvoice(req: Request, res: Response) {
        try {
            const { invoiceId } = req.params;

            const deletedInvoice = await Invoice.findByIdAndUpdate(invoiceId, { isDeleted: true }, { new: true });

            console.log(deletedInvoice);
            if (!deletedInvoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
            return res.status(200).json({ message: 'Invoice deleted (soft deletion)' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting invoice' });
        }
    }

    // listing invoices
    async viewInvoice(req: Request, res: Response) {
        const findData = await Invoice.find({}).sort({ createdAt: -1 }).populate('products', ['productCode', 'name', 'createdAt']).exec();

        res.send(findData);
    }

    // listing invoices
    async viewProductByInvoices(req: Request, res: Response) {
        const findData = await Invoice.findById(req.params.invoiceId).populate('products', [ 'name']);

        res.send(findData?.products);
    }

    //view invoices for invoice id and createdAt
    async viewInvoiceonlyCreatedAtandID(req: Request, res: Response) {
        const findData = await Invoice.find({} , { '_id' : 1, 'createdAt' : 1});

        res.send(findData);
    }

}
export default InvoiceController;