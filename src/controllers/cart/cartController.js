import prisma from "../../config/prisma.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export const getAllCart = async (req, res) => {
  const carts = await prisma.cart.findMany(
    { where: { userId: req.user.id } },
    { include: { product: true } }
  );
  return successResponse(res, "Cart fetched successfully", carts);
};

export const addToCart = async (req, res) => {
  console.log("Request Body:", req.body);
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return errorResponse(res, "Product ID and quantity are required", 400);
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return errorResponse(res, "Product not found", 404);
  }

  let total = product.price * quantity;

  //   update cart if product exists in cart
  const existingCartItem = await prisma.cart.findFirst({
    where: {
      productId,
      userId: req.user.id,
    },
  });

  if (existingCartItem) {
    const updatedCartItem = await prisma.cart.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + quantity,
        total: existingCartItem.total + total,
      },
    });
    return successResponse(res, "Cart updated successfully", updatedCartItem);
  } //   else add new product to cart
  const cart = await prisma.cart.create({
    data: {
      userId: req.user.id,
      productId,
      quantity,
      total,
    },
  });

  return successResponse(res, "Product added to cart successfully", cart);
};
