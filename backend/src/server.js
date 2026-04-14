import express from "express";
import helpdeskRoutes from "./routes/helpdeskRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5001; // Use PORT from environment variables or default to 5001

const app = express();

// CHỈ DÙNG MỘT CẤU HÌNH CORS DUY NHẤT
const corsOptions = {
  // Ưu tiên lấy từ .env, nếu không có thì mặc định localhost của Vite
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true, // Bắt buộc phải có để gửi cookie/token
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Các middleware khác
app.use(express.json());
app.use(cookieParser());

// public routes
app.use("/api/auth", authRoute);

// private routes — protectedRoute được apply trong từng route file
app.use("/api/users", userRoute);
app.use("/api/responses", helpdeskRoutes);

connectDB(); //kết nối đến MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});