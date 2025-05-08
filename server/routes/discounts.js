import express from "express"
import { authenticate, isAdmin } from "../middleware/authMiddleware.js"
import * as discountModel from "../models/discountModel.js"

const router = express.Router()

// Kiểm tra mã giảm giá
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ message: "Vui lòng nhập mã giảm giá" })
    }

    const discount = await discountModel.validateDiscount(code)

    if (!discount) {
      return res.status(404).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" })
    }

    res.status(200).json({ discount })
  } catch (error) {
    console.error("Lỗi kiểm tra mã giảm giá:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Admin: Lấy tất cả mã giảm giá
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const discounts = await discountModel.getAllDiscounts()

    res.status(200).json({ discounts })
  } catch (error) {
    console.error("Lỗi lấy danh sách mã giảm giá:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Admin: Tạo mã giảm giá mới
router.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { code, discount_percent, expiration_date } = req.body

    if (!code || !discount_percent || !expiration_date) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" })
    }

    // Kiểm tra mã giảm giá đã tồn tại chưa
    const existingDiscount = await discountModel.getDiscountByCode(code)
    if (existingDiscount) {
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" })
    }

    const newDiscount = await discountModel.createDiscount({
      code,
      discount_percent,
      expiration_date,
    })

    res.status(201).json({
      message: "Tạo mã giảm giá thành công",
      discount: newDiscount,
    })
  } catch (error) {
    console.error("Lỗi tạo mã giảm giá:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Admin: Cập nhật mã giảm giá
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { code, discount_percent, expiration_date } = req.body

    if (!code || !discount_percent || !expiration_date) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" })
    }

    // Kiểm tra mã giảm giá đã tồn tại chưa (nếu thay đổi code)
    const existingDiscount = await discountModel.getDiscountByCode(code)
    if (existingDiscount && existingDiscount.id !== Number.parseInt(id)) {
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" })
    }

    const updatedDiscount = await discountModel.updateDiscount(id, {
      code,
      discount_percent,
      expiration_date,
    })

    if (!updatedDiscount) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" })
    }

    res.status(200).json({
      message: "Cập nhật mã giảm giá thành công",
      discount: updatedDiscount,
    })
  } catch (error) {
    console.error("Lỗi cập nhật mã giảm giá:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Admin: Xóa mã giảm giá
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const deletedDiscount = await discountModel.deleteDiscount(id)

    if (!deletedDiscount) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" })
    }

    res.status(200).json({
      message: "Xóa mã giảm giá thành công",
      discount: deletedDiscount,
    })
  } catch (error) {
    console.error("Lỗi xóa mã giảm giá:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

export default router
