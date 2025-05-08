import express from "express"
import { authenticate, isAdmin } from "../middleware/authMiddleware.js"
import * as orderModel from "../models/orderModel.js"

const router = express.Router()

// Tạo đơn hàng mới
router.post("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const { shipping_address, discount_code } = req.body

    if (!shipping_address) {
      return res.status(400).json({ message: "Vui lòng nhập địa chỉ giao hàng" })
    }

    const order = await orderModel.createOrder(userId, shipping_address, discount_code)

    res.status(201).json({
      message: "Đặt hàng thành công",
      order,
    })
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error)

    if (error.message === "Giỏ hàng trống") {
      return res.status(400).json({ message: "Giỏ hàng trống" })
    }

    res.status(500).json({ message: "Lỗi server" })
  }
})

// Lấy danh sách đơn hàng của người dùng
router.get("/my-orders", authenticate, async (req, res) => {
  try {
    const userId = req.user.id

    const orders = await orderModel.getUserOrders(userId)

    res.status(200).json({ orders })
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Lấy chi tiết đơn hàng
router.get("/:id", authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const orderId = req.params.id

    const order = await orderModel.getOrderById(orderId)

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" })
    }

    // Kiểm tra xem đơn hàng có thuộc về người dùng không (trừ khi là admin)
    if (order.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" })
    }

    res.status(200).json({ order })
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Admin: Lấy tất cả đơn hàng
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query
    const offset = (page - 1) * limit

    const orders = await orderModel.getAllOrders(Number.parseInt(limit), Number.parseInt(offset))

    res.status(200).json({ orders })
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Admin: Cập nhật trạng thái đơn hàng
router.put("/:id/status", authenticate, isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: "Vui lòng nhập trạng thái đơn hàng" })
    }

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ" })
    }

    const updatedOrder = await orderModel.updateOrderStatus(orderId, status)

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" })
    }

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: updatedOrder,
    })
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Admin: Lấy thống kê đơn hàng
router.get("/stats/summary", authenticate, isAdmin, async (req, res) => {
  try {
    const stats = await orderModel.getOrderStats()

    res.status(200).json({ stats })
  } catch (error) {
    console.error("Lỗi lấy thống kê đơn hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

export default router
