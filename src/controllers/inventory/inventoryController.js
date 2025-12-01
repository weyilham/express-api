import prisma from "../../config/prisma.js";
import { successResponse, errorResponse } from "../../utils/response.js";
// getAllInventory,
export const getAllInventory = async (req, res) => {
  const inventories = await prisma.inventory.findMany();
  return successResponse(res, "Inventory fetched successfully", inventories);
};
//   getInventoryById,
export const getInventoryById = async (req, res) => {
  const { id } = req.params;
  const inventory = await prisma.inventory.findUnique({
    where: { id },
  });
  if (!inventory) {
    return errorResponse(res, "Inventory not found", 404);
  }
  return successResponse(res, "Inventory fetched successfully", inventory);
};
//   addInventory,
export const addInventory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return errorResponse(res, "All fields are required", 400);
  }

  const newInventory = await prisma.inventory.create({
    data: {
      name,
      description,
    },
  });
  return successResponse(
    res,
    "Inventory added successfully",
    newInventory,
    200
  );
};
//   updateInventory,
export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const inventory = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!inventory) {
    return errorResponse(res, "Inventory not found", 404);
  }

  const updatedInventory = await prisma.inventory.update({
    where: { id },
    data: {
      name: name || inventory.name,
      description: description || inventory.description,
    },
  });

  return successResponse(
    res,
    "Inventory updated successfully",
    updatedInventory
  );
};
//   deleteInventory,
export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  const inventory = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!inventory) {
    return errorResponse(res, "Inventory not found", 404);
  }

  await prisma.inventory.delete({
    where: { id },
  });

  return successResponse(res, "Inventory deleted successfully", null);
};
