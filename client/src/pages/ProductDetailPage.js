"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa"
import { CartContext } from "../contexts/CartContext"
import { formatCurrency } from "../utils/format"
import api from "../utils/api"
import "./ProductDetailPage.css"

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        // Lấy thông tin sản phẩm
        const response = await api.get(`/products/${id}`)
        setProduct(response.data.product)

        // Lấy sản phẩm liên quan (cùng danh mục)
        if (response.data.product.category_id) {
          const relatedResponse = await api.get(`/products?category=${response.data.product.category_id}&limit=4`)
          // Loại bỏ sản phẩm hiện tại khỏi danh sách sản phẩm liên quan
          const filtered = relatedResponse.data.products.filter((p) => p.id !== Number(id))
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    // Reset quantity khi chuyển sang sản phẩm khác
    setQuantity(1)
  }, [id])

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && value <= product.stock_quantity) {
      setQuantity(value)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity)
  }

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <h2>Không tìm thấy sản phẩm</h2>
          <Link to="/products" className="btn-primary">
            <FaArrowLeft /> Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link> /<Link to="/products">Sản phẩm</Link> /<span>{product.name}</span>
        </div>

        <div className="product-detail">
          <div className="product-image">
            <img src={product.image_url || "/images/product-placeholder.jpg"} alt={product.name} />
          </div>

          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>

            <div className="product-meta">
              <span className="product-category">Danh mục: {product.category_name}</span>
              <span className="product-stock">Tình trạng: {product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}</span>
            </div>

            <div className="product-price">{formatCurrency(product.price)}</div>

            <div className="product-description">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description || "Không có mô tả cho sản phẩm này."}</p>
            </div>

            {product.stock_quantity > 0 ? (
              <>
                <div className="product-quantity">
                  <h3>Số lượng</h3>
                  <div className="quantity-control">
                    <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                      <FaMinus />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                    <button onClick={increaseQuantity} disabled={quantity >= product.stock_quantity}>
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                  <FaShoppingCart />
                  Thêm vào giỏ hàng
                </button>
              </>
            ) : (
              <div className="out-of-stock">
                <p>Sản phẩm hiện đang hết hàng</p>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Sản phẩm liên quan</h2>
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <div className="related-product-card" key={relatedProduct.id}>
                  <Link to={`/products/${relatedProduct.id}`}>
                    <div className="related-product-image">
                      <img
                        src={relatedProduct.image_url || "/images/product-placeholder.jpg"}
                        alt={relatedProduct.name}
                      />
                    </div>
                    <div className="related-product-info">
                      <h3>{relatedProduct.name}</h3>
                      <p className="related-product-price">{formatCurrency(relatedProduct.price)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage
