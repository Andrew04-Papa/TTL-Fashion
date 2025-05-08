import express from "express"
import * as userController from "../controllers/userController.js"
import { authenticate, isAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Đăng ký và đăng nhập
router.post("/register", userController.register)
router.post("/login", userController.login)

// Các route yêu cầu xác thực
router.get("/me", authenticate, userController.getCurrentUser)
router.put("/me", authenticate, userController.updateUser)
router.put("/change-password", authenticate, userController.changePassword)

// Các route dành cho admin
router.get("/", authenticate, isAdmin, userController.getAllUsers)
router.delete("/:id", authenticate, isAdmin, userController.deleteUser)

export default router
