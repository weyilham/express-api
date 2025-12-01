import prisma from "../../config/prisma.js";
import { successResponse, errorResponse } from "../../utils/response.js";

//   getAllInvoice,
export const getAllInvoice = async (req, res) => {
  const invoices = await prisma.invoice.findMany();

  return successResponse(res, "Invoices fetched successfully", invoices);
};
//   getInvoiceById,
export const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
  });
  if (!invoice) {
    return errorResponse(res, "Invoice not found", 404);
  }
  return successResponse(res, "Invoice fetched successfully", invoice);
};
//   getInvoiceByUserEmail,
export const getInvoiceByUserEmail = async (req, res) => {
  const { email } = req.params;

  const invoices = await prisma.invoice.findMany({
    where: { email: email },
  });
  if (!invoices || invoices.length === 0) {
    return errorResponse(res, "No invoices found for this email", 404);
  }
  return successResponse(res, "Invoices fetched successfully", invoices);
};

// checkout
export const Checkout = async (req, res) => {
  const { email, name, phone, date } = req.body;

  if (!email || !name || !phone || !date) {
    return errorResponse(res, "All fields are required", 400);
  }

  // cari dlu di cart berdasarkan user login
  const cartItems = await prisma.cart.findMany({
    where: { userId: req.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return errorResponse(res, "Cart is empty", 400);
  }

  const items = cartItems
    .map((c) => `${c.product.name} X ${c.quantity}`)
    .join(", ");

  const total = cartItems.reduce((sum, c) => sum + c.total, 0);

  const invoice = await prisma.invoice.create({
    data: {
      email,
      name,
      phone,
      date: new Date(date),
      items,
      total,
      userId: req.user.id,
    },
  });

  //   hapus cart setelah checkout
  await prisma.cart.deleteMany({
    where: { userId: req.user.id },
  });

  return successResponse(res, "Invoice created successfully", invoice);
};
