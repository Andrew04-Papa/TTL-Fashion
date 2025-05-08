import jwt from "jsonwebtoken"
import { findUserById } from "../models/userModel.js"

// Middleware xác thực người dùng
export const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token xác thực" })
    }

    const token = authHeader.split(" ")[1]

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Kiểm tra người dùng có tồn tại không
    const user = await findUserById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" })
    }

    // Lưu thông tin người dùng vào request
    req.user = { id: user.id, email: user.email }
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token không hợp lệ" })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn" })
    }

    console.error("Lỗi xác thực:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Middleware kiểm tra quyền admin
export const isAdmin = async (req, res, next) => {
  try {
    // Lấy thông tin người dùng từ middleware authenticate
    const userId = req.user.id

    // Kiểm tra người dùng có phải admin không
    const user = await findUserById(userId)

    // Giả sử có trường role trong bảng users
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" })
    }

    next()
  } catch (error) {
    console.error("Lỗi kiểm tra quyền admin:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}
