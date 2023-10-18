import express from 'express';
import InvoiceController from '../controller/invoices';
import { auth } from '../auth/auth';

const router = express.Router();

const invoiceController = new InvoiceController();

router.post('/invoice' , auth ,  invoiceController.createInvoice);
router.patch('/invoice/:id', invoiceController.editInvoice);
router.delete('/invoice/:invoiceId', invoiceController.deleteInvoice);
router.get('/invoice/:invoiceId', invoiceController.viewProductByInvoices);
router.get('/invoices', invoiceController.viewInvoice);
router.get('/invoice', invoiceController.viewInvoiceonlyCreatedAtandID);

export default router;