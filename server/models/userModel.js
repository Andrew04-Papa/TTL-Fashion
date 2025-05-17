import { query } from "../db/index.js"
import bcrypt from "bcrypt"

export const findUserByEmail = async (email) => {
  const result = await query("SELECT * FROM users WHERE email = $1", [email])
  return result.rows[0]
}

export const findUserById = async (id) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [id])
  return result.rows[0]
}

export const createUser = async (userData) => {
  const { full_name, email, password, phone, address } = userData

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Thêm trường role mặc định là "customer"
  const result = await query(
    "INSERT INTO users (full_name, email, password, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [full_name, email, hashedPassword, phone, address, "customer"],
  )

  // Tạo giỏ hàng cho người dùng mới
  if (result.rows[0]) {
    await query("INSERT INTO carts (user_id) VALUES ($1)", [result.rows[0].id])
  }

  return result.rows[0]
}

export const updateUser = async (id, userData) => {
  const { full_name, email, phone, address, avatar_url } = userData

  // Kiểm tra xem có avatar_url không
  if (avatar_url) {
    const result = await query(
      "UPDATE users SET full_name = $1, email = $2, phone = $3, address = $4, avatar_url = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [full_name, email, phone, address, avatar_url, id],
    )
    return result.rows[0]
  } else {
    const result = await query(
      "UPDATE users SET full_name = $1, email = $2, phone = $3, address = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [full_name, email, phone, address, id],
    )
    return result.rows[0]
  }
}

export const updateAvatarUrl = async (id, avatarUrl) => {
  const result = await query(
    "UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [avatarUrl, id],
  )
  return result.rows[0]
}

export const updatePassword = async (id, newPassword) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  const result = await query("UPDATE users SET password = $1 WHERE id = $2 RETURNING id", [hashedPassword, id])

  return result.rows[0]
}

export const getAllUsers = async () => {
  const result = await query("SELECT id, full_name, email, phone, address, role, avatar_url, created_at FROM users")
  return result.rows
}

export const deleteUser = async (id) => {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING *", [id])
  return result.rows[0]
}

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}
