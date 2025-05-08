import express from "express"
import { authenticate } from "../middleware/authMiddleware.js"
import { query } from "../db/index.js"
import * as cartModel from "../models/cartModel.js"

const router = express.Router()

// Lấy giỏ hàng của người dùng
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await cartModel.getCartByUserId(userId)

    res.status(200).json({ cart })
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Thêm sản phẩm vào giỏ hàng
router.post("/items", authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id, quantity } = req.body

    // Kiểm tra số lượng
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" })
    }

    // Kiểm tra sản phẩm có tồn tại không
    const productResult = await query("SELECT * FROM products WHERE id = $1", [product_id])
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
    }

    // Kiểm tra số lượng tồn kho
    const product = productResult.rows[0]
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: "Số lượng sản phẩm không đủ" })
    }

    // Lấy giỏ hàng của người dùng
    const cart = await cartModel.getCartByUserId(userId)

    // Thêm sản phẩm vào giỏ hàng
    const cartItem = await cartModel.addToCart(cart.id, product_id, quantity)

    res.status(201).json({
      message: "Thêm vào giỏ hàng thành công",
      cart_item: cartItem,
    })
  } catch (error) {
    console.error("Lỗi thêm vào giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/items/:id", authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const cartItemId = req.params.id
    const { quantity } = req.body

    // Kiểm tra số lượng
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" })
    }

    // Kiểm tra xem cart item có thuộc về người dùng không
    const cart = await cartModel.getCartByUserId(userId)
    const cartItem = await cartModel.getCartItemById(cartItemId)

    if (!cartItem || cartItem.cart_id !== cart.id) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" })
    }

    // Kiểm tra số lượng tồn kho
    const productResult = await query("SELECT * FROM products WHERE id = $1", [cartItem.product_id])
    const product = productResult.rows[0]

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: "Số lượng sản phẩm không đủ" })
    }

    // Cập nhật số lượng
    const updatedCartItem = await cartModel.updateCartItem(cartItemId, quantity)

    res.status(200).json({
      message: "Cập nhật giỏ hàng thành công",
      cart_item: updatedCartItem,
    })
  } catch (error) {
    console.error("Lỗi cập nhật giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/items/:id", authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const cartItemId = req.params.id

    // Kiểm tra xem cart item có thuộc về người dùng không
    const cart = await cartModel.getCartByUserId(userId)
    const cartItem = await cartModel.getCartItemById(cartItemId)

    if (!cartItem || cartItem.cart_id !== cart.id) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" })
    }

    // Xóa sản phẩm khỏi giỏ hàng
    const removedCartItem = await cartModel.removeCartItem(cartItemId)

    res.status(200).json({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      cart_item: removedCartItem,
    })
  } catch (error) {
    console.error("Lỗi xóa sản phẩm khỏi giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// Xóa tất cả sản phẩm trong giỏ hàng
router.delete("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id

    // Lấy giỏ hàng của người dùng
    const cart = await cartModel.getCartByUserId(userId)

    // Xóa tất cả sản phẩm trong giỏ hàng
    await cartModel.clearCart(cart.id)

    res.status(200).json({ message: "Đã xóa tất cả sản phẩm trong giỏ hàng" })
  } catch (error) {
    console.error("Lỗi xóa giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
})

export default router
