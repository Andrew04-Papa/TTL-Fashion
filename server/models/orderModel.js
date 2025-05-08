import { query } from "../db/index.js"
import { getCartByUserId, clearCart } from "./cartModel.js"
import { updateStock } from "./productModel.js"

export const createOrder = async (userId, shippingAddress, discountCode = null) => {
  // Bắt đầu transaction
  const client = await query("BEGIN")

  try {
    // Lấy giỏ hàng của người dùng
    const cart = await getCartByUserId(userId)

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Giỏ hàng trống")
    }

    let discountPercent = 0

    // Kiểm tra mã giảm giá nếu có
    if (discountCode) {
      const discountResult = await query(
        "SELECT * FROM discount_codes WHERE code = $1 AND expiration_date >= CURRENT_DATE",
        [discountCode],
      )

      if (discountResult.rows.length > 0) {
        discountPercent = discountResult.rows[0].discount_percent
      }
    }

    // Tính tổng tiền
    let totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Áp dụng giảm giá nếu có
    if (discountPercent > 0) {
      totalAmount = totalAmount * (1 - discountPercent / 100)
    }

    // Tạo đơn hàng mới
    const orderResult = await query(
      "INSERT INTO orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING *",
      [userId, totalAmount, shippingAddress],
    )

    const order = orderResult.rows[0]

    // Thêm các sản phẩm vào chi tiết đơn hàng
    for (const item of cart.items) {
      await query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)", [
        order.id,
        item.id,
        item.quantity,
        item.price,
      ])

      // Cập nhật số lượng tồn kho
      await updateStock(item.id, item.quantity)
    }

    // Xóa các sản phẩm trong giỏ hàng
    await clearCart(cart.id)

    // Commit transaction
    await query("COMMIT")

    return order
  } catch (error) {
    // Rollback nếu có lỗi
    await query("ROLLBACK")
    throw error
  }
}

export const getOrderById = async (orderId) => {
  const orderResult = await query("SELECT * FROM orders WHERE id = $1", [orderId])

  if (orderResult.rows.length === 0) {
    return null
  }

  const order = orderResult.rows[0]

  // Lấy chi tiết đơn hàng
  const itemsResult = await query(
    `SELECT oi.*, p.name, p.image_url 
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId],
  )

  return {
    ...order,
    items: itemsResult.rows,
  }
}

export const getUserOrders = async (userId) => {
  const result = await query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [userId])

  return result.rows
}

export const getAllOrders = async (limit = 20, offset = 0) => {
  const result = await query(
    `SELECT o.*, u.full_name, u.email 
     FROM orders o
     JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  )

  return result.rows
}

export const updateOrderStatus = async (orderId, status) => {
  const result = await query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [status, orderId])

  return result.rows[0]
}

export const getOrderStats = async () => {
  const result = await query(`
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_revenue,
      COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_orders,
      COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_orders
    FROM orders
  `)

  return result.rows[0]
}
