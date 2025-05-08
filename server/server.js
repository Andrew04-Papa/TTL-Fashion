import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"

// Import routes
import userRoutes from "./routes/users.js"
import productRoutes from "./routes/products.js"
import cartRoutes from "./routes/carts.js"
import orderRoutes from "./routes/orders.js"
import discountRoutes from "./routes/discounts.js"

// Cấu hình dotenv
dotenv.config()

// Khởi tạo express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

// Đường dẫn tĩnh cho uploads
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/discounts", discountRoutes)

// Route mặc định
app.get("/", (req, res) => {
  res.json({ message: "Chào mừng đến với API TTL-Fashion" })
})

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ message: "Route không tồn tại" })
})

// Xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Lỗi server" })
})

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`)
})

export default app
