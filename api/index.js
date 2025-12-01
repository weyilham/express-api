import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "../src/routes/authRoutes.js";
import inventoryRoutes from "../src/routes/inventoryRoutes.js";
import productRoutes from "../src/routes/productRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/products", productRoutes);

// fallback (optional)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
