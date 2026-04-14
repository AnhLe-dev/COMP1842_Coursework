
import express from "express";

// 1. Import các hàm từ Controller
import {
  getResponseById,
  createResponse,
  getResponses,
  updateResponse,
  deleteResponse,
} from "../controllers/helpdeskControllers.js";

// 2. Import middleware phân quyền
import {
  protectedRoute,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

// 3. Khởi tạo router (Đây là dòng code bị thiếu gây ra lỗi của bạn)
const router = express.Router();

// ==========================================
// CÁC API ENDPOINTS & PHÂN QUYỀN
// ==========================================

// BẮT BUỘC: Mọi request vào /helpdesk đều phải đi qua chốt kiểm tra đăng nhập
router.use(protectedRoute);

// QUYỀN CỦA STAFF VÀ ADMIN (Read & Quiz)
router.get("/", authorizeRoles("staff", "admin"), getResponses);
router.get("/:id", authorizeRoles("staff", "admin"), getResponseById);

// QUYỀN RIÊNG CỦA ADMIN (CRUD & Dashboard)
router.post("/", authorizeRoles("admin"), createResponse);
router.put("/:id", authorizeRoles("admin"), updateResponse);
router.delete("/:id", authorizeRoles("admin"), deleteResponse);

export default router;
