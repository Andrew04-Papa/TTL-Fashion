"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { FaShoppingCart, FaEye } from "react-icons/fa"
import { CartContext } from "../../contexts/CartContext.js"
import { formatCurrency } from "../../utils/format.js"
import "./ProductCard.css"

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product.id, 1)
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image_url || "/images/product-placeholder.jpg"} alt={product.name} />
        <div className="product-actions">
          <button className="btn-add-cart" onClick={handleAddToCart}>
            <FaShoppingCart />
            <span>Thêm vào giỏ</span>
          </button>
          <Link to={`/products/${product.id}`} className="btn-view">
            <FaEye />
            <span>Xem chi tiết</span>
          </Link>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-category">{product.category_name}</p>
        <p className="product-price">{formatCurrency(product.price)}</p>
      </div>
    </div>
  )
}

export default ProductCard
