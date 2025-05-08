import { query } from "../db/index.js"

export const getCartByUserId = async (userId) => {
  // Lấy thông tin giỏ hàng
  const cartResult = await query("SELECT * FROM carts WHERE user_id = $1", [userId])

  if (cartResult.rows.length === 0) {
    // Tạo giỏ hàng mới nếu chưa có
    const newCartResult = await query("INSERT INTO carts (user_id) VALUES ($1) RETURNING *", [userId])
    return { ...newCartResult.rows[0], items: [] }
  }

  const cart = cartResult.rows[0]

  // Lấy các sản phẩm trong giỏ hàng
  const itemsResult = await query(
    `SELECT ci.id, ci.quantity, p.* 
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = $1`,
    [cart.id],
  )

  return {
    ...cart,
    items: itemsResult.rows,
  }
}

export const addToCart = async (cartId, productId, quantity) => {
  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItem = await query("SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2", [
    cartId,
    productId,
  ])

  if (existingItem.rows.length > 0) {
    // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
    const result = await query(
      "UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *",
      [quantity, cartId, productId],
    )
    return result.rows[0]
  } else {
    // Thêm sản phẩm mới vào giỏ hàng
    const result = await query(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [cartId, productId, quantity],
    )
    return result.rows[0]
  }
}

export const updateCartItem = async (cartItemId, quantity) => {
  const result = await query("UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *", [quantity, cartItemId])

  return result.rows[0]
}

export const removeCartItem = async (cartItemId) => {
  const result = await query("DELETE FROM cart_items WHERE id = $1 RETURNING *", [cartItemId])

  return result.rows[0]
}

export const clearCart = async (cartId) => {
  const result = await query("DELETE FROM cart_items WHERE cart_id = $1 RETURNING *", [cartId])

  return result.rows
}

export const getCartItemById = async (cartItemId) => {
  const result = await query("SELECT * FROM cart_items WHERE id = $1", [cartItemId])

  return result.rows[0]
}
