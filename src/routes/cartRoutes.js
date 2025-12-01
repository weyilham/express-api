import express from "express";
import { getAllCart, addToCart } from "../controllers/cart/cartController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getAllCart);
router.post("/", addToCart);

export default router;
