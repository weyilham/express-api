import express from "express";
import {
  getSingle,
  getRange,
} from "../controllers/statistik/statistikController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);
router.get("/single", getSingle);
router.get("/range", getRange);

export default router;
