import express from "express"
import multer from "multer"
import * as userController from "../controllers/userController.js"
import { authenticate, isAdmin } from "../middleware/authMiddleware.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

// Đảm bảo thư mục uploads tồn tại
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, "..", "uploads", "avatars")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Cấu hình multer để xử lý upload file
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file hình ảnh
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Chỉ chấp nhận file hình ảnh"), false)
    }
  },
})

// Đăng ký và đăng nhập
router.post("/register", userController.register)
router.post("/login", userController.login)

// Các route yêu cầu xác thực
router.get("/me", authenticate, userController.getCurrentUser)
router.put("/me", authenticate, userController.updateUser)
router.put("/change-password", authenticate, userController.changePassword)
router.post("/upload-avatar", authenticate, upload.single("avatar"), userController.uploadAvatar)

// Các route dành cho admin
router.get("/", authenticate, isAdmin, userController.getAllUsers)
router.delete("/:id", authenticate, isAdmin, userController.deleteUser)

export default router
