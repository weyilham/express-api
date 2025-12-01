import express from "express";
import {
  getAllInventory,
  getInventoryById,
  addInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventory/inventoryController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getAllInventory);
router.get("/:id", getInventoryById);
router.post("/", addInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
