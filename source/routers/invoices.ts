import express from 'express';
import InvoiceController from '../controller/invoices';
import { auth } from '../auth/auth';

const router = express.Router();

const invoiceController = new InvoiceController();

router.post('/create' , auth ,  invoiceController.createInvoice);
router.patch('/edit', invoiceController.editInvoice);
router.delete('/delete/:invoiceId', invoiceController.deleteInvoice);
router.get('/view/:invoiceId', invoiceController.viewInvoice);

export default router;