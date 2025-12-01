import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import InvoiceRoutes from "./routes/invoiceRoutes.js";
import StatistikRoutes from "./routes/statistikRoutes.js";

// setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load dotenv variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});
// routes image static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/invoice", InvoiceRoutes);
app.use("/api/statistik", StatistikRoutes);

// not found route
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

export default app;
