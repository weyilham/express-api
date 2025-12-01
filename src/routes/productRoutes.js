import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByInventoryId,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product/productController.js";
import { verifyToken } from "../middleware/verifyToken.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/inventory/:inventoryId", getProductsByInventoryId);
router.post("/", verifyToken, upload.single("image"), addProduct);
router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
