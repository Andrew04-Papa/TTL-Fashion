"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from "react-icons/fa"
import { CartContext } from "../contexts/CartContext"
import { AuthContext } from "../contexts/AuthContext"
import { formatCurrency } from "../utils/format"
import "./CartPage.css"

const CartPage = () => {
  const { cart, updateCartItem, removeCartItem, calculateTotal, loading } = useContext(CartContext)
  const { currentUser } = useContext(AuthContext)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const navigate = useNavigate()

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      removeCartItem(itemId)
    }
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá")
      return
    }

    // Giả lập kiểm tra mã giảm giá
    // Trong thực tế, bạn sẽ gọi API để kiểm tra
    setCouponError("Mã giảm giá không hợp lệ hoặc đã hết hạn")
  }

  const handleCheckout = () => {
    if (!currentUser) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      navigate("/login", { state: { from: "/checkout" } })
    } else {
      // Nếu đã đăng nhập, chuyển hướng đến trang thanh toán
      navigate("/checkout")
    }
  }

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to="/products" className="btn-primary">
              <FaArrowLeft /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Giỏ hàng của bạn</h1>

        <div className="cart-container">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id}>
                    <td className="product-cell">
                      <div className="product-info">
                        <img src={item.image_url || "/images/product-placeholder.jpg"} alt={item.name} />
                        <div>
                          <Link to={`/products/${item.id}`}>{item.name}</Link>
                          {item.category_name && <span className="product-category">{item.category_name}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="price-cell">{formatCurrency(item.price)}</td>
                    <td className="quantity-cell">
                      <div className="quantity-control">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                        />
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="total-cell">{formatCurrency(item.price * item.quantity)}</td>
                    <td className="action-cell">
                      <button className="remove-item" onClick={() => handleRemoveItem(item.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <h2>Tổng giỏ hàng</h2>

            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>

            <div className="coupon-form">
              <input
                type="text"
                placeholder="Mã giảm giá"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>Áp dụng</button>
            </div>

            {couponError && <div className="coupon-error">{couponError}</div>}

            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>

            <button className="btn-checkout" onClick={handleCheckout}>
              Tiến hành thanh toán
            </button>

            <Link to="/products" className="continue-shopping">
              <FaArrowLeft /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
