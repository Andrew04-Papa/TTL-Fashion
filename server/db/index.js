import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

// Tạo kết nối pool với PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
})

// Kiểm tra kết nối
pool.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối đến cơ sở dữ liệu:", err.stack)
  } else {
    console.log("Kết nối thành công đến PostgreSQL")
  }
})

// Hàm truy vấn đơn giản
export const query = (text, params) => pool.query(text, params)

export default pool
