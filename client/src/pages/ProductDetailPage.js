"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft, FaStar, FaStarHalfAlt, FaRegStar, FaCheck } from "react-icons/fa"
import { CartContext } from "../contexts/CartContext.js"
import { formatCurrency } from "../utils/format.js"
import api from "../utils/api.js"
import ProductCard from "../components/product/ProductCard.js"
import "./ProductDetailPage.css"

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Tạo mảng hình ảnh cho demo (trong thực tế sẽ lấy từ dữ liệu sản phẩm)
  const [productImages, setProductImages] = useState([
    { id: 0, url: "" }, // Sẽ được thay thế bằng hình ảnh chính của sản phẩm
    { id: 1, url: "/images/product-placeholder.jpg" },
    { id: 2, url: "/images/product-placeholder.jpg" },
    { id: 3, url: "/images/product-placeholder.jpg" },
  ])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        // Lấy thông tin sản phẩm
        const response = await api.get(`/products/${id}`)
        setProduct(response.data.product)

        // Cập nhật hình ảnh đầu tiên với hình ảnh sản phẩm
        const updatedImages = [...productImages]
        updatedImages[0].url = response.data.product.image_url || "/images/product-placeholder.jpg"
        setProductImages(updatedImages)

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
    setActiveImage(0)
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
    setIsAddingToCart(true)
    addToCart(product.id, quantity)

    // Hiển thị hiệu ứng thêm thành công
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

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

  // Tạo rating ngẫu nhiên cho demo
  const rating = product?.rating || 0
  const reviewCount = product?.review_count || 0

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    )
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
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/products">Sản phẩm</Link>
          <span className="breadcrumb-separator">/</span>
          {product.category_name && (
            <>
              <Link to={`/products?category=${product.category_id}`}>{product.category_name}</Link>
              <span className="breadcrumb-separator">/</span>
            </>
          )}
          <span>{product.name}</span>
        </div>

        <div className="product-detail">
          <div className="product-gallery">
            <div className="product-main-image">
              <img src={productImages[activeImage].url || "/images/product-placeholder.jpg"} alt={product.name} />
            </div>

            <div className="product-thumbnails">
              {productImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`product-thumbnail ${activeImage === index ? "active" : ""}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image.url || "/images/product-placeholder.jpg"}
                    alt={`${product.name} - Ảnh ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              {product.category_name && <div className="product-category">{product.category_name}</div>}
              <h1 className="product-name">{product.name}</h1>

              <div className="product-rating">
                <div className="stars">{renderStars(rating)}</div>
                <span className="count">{reviewCount} đánh giá</span>
              </div>

              <div className="product-price">
                {product.original_price && (
                  <span className="original-price">{formatCurrency(product.original_price)}</span>
                )}
                {formatCurrency(product.price)}
                {product.original_price && (
                  <span className="discount">-{Math.round((1 - product.price / product.original_price) * 100)}%</span>
                )}
              </div>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="label">SKU:</span>
                <span className="value">TTL-{product.id.toString().padStart(4, "0")}</span>
              </div>
              {product.category_name && (
                <div className="meta-item">
                  <span className="label">Danh mục:</span>
                  <span className="value">{product.category_name}</span>
                </div>
              )}
            </div>

            <div className="product-description">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description || "Không có mô tả cho sản phẩm này."}</p>
            </div>

            <div className={`product-stock ${product.stock_quantity > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.stock_quantity > 0 ? (
                <>
                  <FaCheck /> Còn hàng ({product.stock_quantity} sản phẩm)
                </>
              ) : (
                <>Hết hàng</>
              )}
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

                <button className="btn-add-to-cart" onClick={handleAddToCart} disabled={isAddingToCart}>
                  <FaShoppingCart />
                  {isAddingToCart ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
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
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage
