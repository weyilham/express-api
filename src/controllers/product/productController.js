import prisma from "../../config/prisma.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import fs from "fs";
import path from "path";

// clean up image file helper
const cleanImageUrl = (base, imagePath) =>
  base.replace(/\/$/, "") + "/" + imagePath.replace(/^\//, "");

//   getAllProducts,
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { inventory: true }, // join inventory data
    });
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const productsWithFullImageUrl = products.map((product) => {
      // clean up image url
      if (product.image) {
        product.image = cleanImageUrl(baseUrl, product.image);
      }
      return product;
    });
    return successResponse(
      res,
      "Products fetched successfully",
      productsWithFullImageUrl
    );
  } catch (error) {
    return errorResponse(res, "get all products failed", 500);
  }
};
//   getProductById,
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: id },
    });
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const productsWithFullImageUrl = product.map((p) => {
      // clean up image url
      if (p.image) {
        p.image = cleanImageUrl(baseUrl, p.image);
      }
      return p;
    });
    return successResponse(
      res,
      "Product fetched successfully",
      productsWithFullImageUrl
    );
  } catch (error) {
    return errorResponse(res, "get product failed", 500);
  }
};
//   getProductsByInventoryId,
export const getProductsByInventoryId = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const products = await prisma.product.findMany({
      where: { inventoryId },
    });
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const productsWithFullImageUrl = products.map((product) => {
      // clean up image url
      if (product.image) {
        product.image = cleanImageUrl(baseUrl, product.image);
      }
      return product;
    });
    return successResponse(
      res,
      "Products fetched successfully",
      productsWithFullImageUrl
    );
  } catch (error) {
    return errorResponse(res, "get all products failed", 500);
  }
};
//   addProduct,
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, inventoryId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !description || !price || !stock || !inventoryId) {
      return errorResponse(res, "All fields are required", 400);
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        inventoryId,
        image,
      },
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return successResponse(
      res,
      "Product added successfully",
      {
        ...newProduct,
        image: newProduct.image
          ? cleanImageUrl(baseUrl, newProduct.image)
          : null,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "add product failed", 500);
  }
};
//   updateProduct,
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, inventoryId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    // find existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return errorResponse(res, "Product not found", 404);
    }

    // delete old image if new image is uploaded
    if (image && existingProduct.image) {
      const oldImagePath = path.join(
        "uploads",
        path.basename(existingProduct.image)
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }

    // update product
    const dataToUpdate = {
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      price: price ? parseFloat(price) : existingProduct.price,
      stock: stock ? parseInt(stock) : existingProduct.stock,
      inventoryId: inventoryId || existingProduct.inventoryId,
    };

    if (image) {
      dataToUpdate.image = image;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return successResponse(
      res,
      "Product updated successfully",
      {
        ...updatedProduct,
        image: updatedProduct.image
          ? cleanImageUrl(baseUrl, updatedProduct.image)
          : null,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, "update product failed", 500);
  }
};
//   deleteProduct,
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // find existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return errorResponse(res, "Product not found", 404);
    }
    // delete image file if exists
    if (existingProduct.image) {
      const imagePath = path.join(
        "uploads",
        path.basename(existingProduct.image)
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }
    // delete product
    await prisma.product.delete({
      where: { id },
    });
    return successResponse(res, "Product deleted successfully", null, 200);
  } catch (error) {
    return errorResponse(res, "delete product failed", 500);
  }
};
