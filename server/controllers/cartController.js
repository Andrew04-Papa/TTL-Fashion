import * as cartModel from "../models/cartModel.js"
import { query } from "../db/index.js"

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await cartModel.getCartByUserId(userId)
    res.status(200).json({ cart })
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

export const addCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id, quantity } = req.body

    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Số lượng không hợp lệ" })

    const productResult = await query("SELECT * FROM products WHERE id = $1", [product_id])
    if (productResult.rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" })

    const product = productResult.rows[0]
    if (product.stock_quantity < quantity)
      return res.status(400).json({ message: "Số lượng sản phẩm không đủ" })

    const cart = await cartModel.getCartByUserId(userId)
    const cartItem = await cartModel.addToCart(cart.id, product_id, quantity)

    res.status(201).json({ message: "Thêm vào giỏ hàng thành công", cart_item: cartItem })
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const cartItemId = req.params.id
    const { quantity } = req.body

    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Số lượng không hợp lệ" })

    const cart = await cartModel.getCartByUserId(userId)
    const cartItem = await cartModel.getCartItemById(cartItemId)

    if (!cartItem || cartItem.cart_id !== cart.id)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" })

    const productResult = await query("SELECT * FROM products WHERE id = $1", [cartItem.product_id])
    const product = productResult.rows[0]

    if (product.stock_quantity < quantity)
      return res.status(400).json({ message: "Số lượng sản phẩm không đủ" })

    const updated = await cartModel.updateCartItem(cartItemId, quantity)
    res.status(200).json({ message: "Cập nhật giỏ hàng thành công", cart_item: updated })
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const cartItemId = req.params.id

    const cart = await cartModel.getCartByUserId(userId)
    const cartItem = await cartModel.getCartItemById(cartItemId)

    if (!cartItem || cartItem.cart_id !== cart.id)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" })

    const removed = await cartModel.removeCartItem(cartItemId)
    res.status(200).json({ message: "Xóa sản phẩm thành công", cart_item: removed })
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await cartModel.getCartByUserId(userId)
    await cartModel.clearCart(cart.id)
    res.status(200).json({ message: "Đã xóa tất cả sản phẩm" })
  } catch (error) {
    console.error("Lỗi xóa giỏ hàng:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}
