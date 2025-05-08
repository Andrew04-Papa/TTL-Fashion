import * as userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"

// Đăng ký người dùng mới
export const register = async (req, res) => {
  try {
    const { full_name, email, password, phone, address } = req.body

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
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" })

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
    const { full_name, email, phone, address } = req.body

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

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id
    const { currentPassword, newPassword } = req.body

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
