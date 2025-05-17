import * as userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Đăng ký người dùng mới
export const register = async (req, res) => {
  try {
    const { full_name, email, password, phone, address } = req.body

    // Kiểm tra các trường bắt buộc
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin bắt buộc" })
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ" })
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" })
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await userModel.findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" })
    }

    // Tạo người dùng mới
    const newUser = await userModel.createUser({
      full_name,
      email,
      password,
      phone,
      address,
    })

    // Loại bỏ mật khẩu trước khi trả về
    const { password: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      message: "Đăng ký thành công",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Lỗi đăng ký:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" })
    }

    // Tìm người dùng theo email
    const user = await userModel.findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" })
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await userModel.comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" })
    }

    // Tạo JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || "customer" }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    // Loại bỏ mật khẩu trước khi trả về
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Lỗi đăng nhập:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await userModel.findUserById(userId)
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" })
    }

    // Loại bỏ mật khẩu trước khi trả về
    const { password, ...userWithoutPassword } = user

    res.status(200).json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id
    const { full_name, email, phone, address, avatar_url } = req.body

    // Kiểm tra xem email đã tồn tại chưa (nếu thay đổi email)
    if (email) {
      const existingUser = await userModel.findUserByEmail(email)
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Email đã được sử dụng" })
      }
    }

    const updatedUser = await userModel.updateUser(userId, {
      full_name,
      email,
      phone,
      address,
      avatar_url,
    })

    // Loại bỏ mật khẩu trước khi trả về
    const { password, ...userWithoutPassword } = updatedUser

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Lỗi cập nhật thông tin:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Tải lên ảnh đại diện
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id

    if (!req.file) {
      return res.status(400).json({ message: "Không có file được tải lên" })
    }

    // Tạo đường dẫn lưu file
    const uploadsDir = path.join(__dirname, "..", "uploads", "avatars")

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Tạo tên file duy nhất
    const fileExt = path.extname(req.file.originalname)
    const fileName = `${userId}_${Date.now()}${fileExt}`
    const filePath = path.join(uploadsDir, fileName)

    // Lưu file
    try {
      fs.writeFileSync(filePath, req.file.buffer)
      console.log(`File saved successfully at: ${filePath}`)
    } catch (writeError) {
      console.error("Error writing file:", writeError)
      return res.status(500).json({ message: "Không thể lưu file: " + writeError.message })
    }

    // Tạo URL cho ảnh đại diện
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${fileName}`

    // Cập nhật URL ảnh đại diện trong cơ sở dữ liệu
    try {
      const updatedUser = await userModel.updateAvatarUrl(userId, avatarUrl)
      if (!updatedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" })
      }
      req.user.avatar_url = avatarUrl
    } catch (dbError) {
      console.error("Error updating avatar URL in database:", dbError)
      return res
        .status(500)
        .json({ message: "Không thể cập nhật ảnh đại diện trong cơ sở dữ liệu: " + dbError.message })
    }

    res.status(200).json({
      message: "Tải lên ảnh đại diện thành công",
      avatar_url: avatarUrl,
    })
  } catch (error) {
    console.error("Lỗi tải lên ảnh đại diện:", error)
    res.status(500).json({ message: "Lỗi server: " + error.message })
  }
}

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

    // Kiểm tra các trường bắt buộc
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" })
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" })
    }

    // Lấy thông tin người dùng
    const user = await userModel.findUserById(userId)

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await userModel.comparePassword(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" })
    }

    // Cập nhật mật khẩu mới
    await userModel.updatePassword(userId, newPassword)

    res.status(200).json({ message: "Đổi mật khẩu thành công" })
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Admin: Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers()
    res.status(200).json({ users })
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Admin: Xóa người dùng
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const deletedUser = await userModel.deleteUser(id)
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" })
    }

    res.status(200).json({
      message: "Xóa người dùng thành công",
      user: deletedUser,
    })
  } catch (error) {
    console.error("Lỗi xóa người dùng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}
