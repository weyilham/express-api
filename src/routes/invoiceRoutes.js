import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  Checkout,
  getAllInvoice,
  getInvoiceById,
  getInvoiceByUserEmail,
} from "../controllers/invoice/invoiceController.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getAllInvoice);
router.get("/:id", getInvoiceById);
router.get("/user/:email", getInvoiceByUserEmail);
router.post("/checkout", Checkout);

export default router;
