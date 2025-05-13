"use client"

import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { FaShoppingCart, FaEye, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"
import { CartContext } from "../../contexts/CartContext.js"
import { formatCurrency } from "../../utils/format.js"
import "./ProductCard.css"

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    setIsAdding(true)

    // Thêm vào giỏ hàng
    addToCart(product.id, 1)

    // Hiển thị hiệu ứng thêm thành công
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  // Sử dụng rating từ dữ liệu sản phẩm, không tạo ngẫu nhiên
  const rating = product.rating || 0
  const reviewCount = product.review_count || 0

  // Hàm render sao đánh giá
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} />)
      } else {
        stars.push(<FaRegStar key={i} />)
      }
    }

    return stars
  }

  // Kiểm tra sản phẩm mới (dưới 14 ngày)
  const isNew = () => {
    if (!product.created_at) return false
    const productDate = new Date(product.created_at)
    const now = new Date()
    const diffTime = Math.abs(now - productDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 14
  }

  const isProductNew = isNew()

  return (
    <div className={`product-card ${isProductNew ? "new" : ""}`}>
      {isProductNew && <span className="product-badge">Mới</span>}
      <div className="product-image">
        <img src={product.image_url || "/images/product-placeholder.jpg"} alt={product.name} />
        <div className="product-actions">
          <button className={`btn-add-cart ${isAdding ? "adding" : ""}`} onClick={handleAddToCart} disabled={isAdding}>
            <FaShoppingCart />
            <span>{isAdding ? "Đã thêm" : "Thêm vào giỏ"}</span>
          </button>
          <Link to={`/products/${product.id}`} className="btn-view">
            <FaEye />
            <span>Xem chi tiết</span>
          </Link>
        </div>
      </div>
      <div className="product-info">
        {product.category_name && <p className="product-category">{product.category_name}</p>}
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-rating">
          <div className="stars">{renderStars(rating)}</div>
          <span className="count">({reviewCount})</span>
        </div>
        <p className="product-price">
          {product.original_price && <span className="original-price">{formatCurrency(product.original_price)}</span>}
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
