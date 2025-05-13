"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaArrowRight, FaShoppingBag } from "react-icons/fa"
import api from "../utils/api.js"
import ProductCard from "../components/product/ProductCard.js"
import "./HomePage.css"

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Lấy danh sách danh mục
        const categoriesResponse = await api.get("/products/categories")
        setCategories(categoriesResponse.data.categories)

        // Lấy sản phẩm nổi bật (giả định là 4 sản phẩm đầu tiên)
        const featuredResponse = await api.get("/products?limit=4")
        setFeaturedProducts(featuredResponse.data.products)

        // Lấy sản phẩm mới nhất (giả định là 4 sản phẩm tiếp theo)
        const newArrivalsResponse = await api.get("/products?limit=4&offset=4")
        setNewArrivals(newArrivalsResponse.data.products)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Countdown timer cho promotion
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 8,
    minutes: 45,
    seconds: 30,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime

        if (seconds > 0) {
          seconds -= 1
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes -= 1
          } else {
            minutes = 59
            if (hours > 0) {
              hours -= 1
            } else {
              hours = 23
              if (days > 0) {
                days -= 1
              } else {
                // Kết thúc countdown
                clearInterval(timer)
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Thời trang cao cấp cho phong cách của bạn</h1>
            <p>
              Khám phá bộ sưu tập mới nhất với các thiết kế độc đáo và chất lượng hàng đầu. Nâng tầm phong cách của bạn
              với TTL-Fashion.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn-primary">
                Mua sắm ngay
              </Link>
              <Link to="/about" className="btn-secondary">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Danh mục sản phẩm</h2>
            <p className="section-subtitle">Khám phá các danh mục sản phẩm đa dạng của chúng tôi</p>
          </div>

          <div className="categories-grid">
            {categories.slice(0, 4).map((category) => (
              <div className="category-card" key={category.id}>
                <div className="category-image">
                  <img
                    src={`/images/category-${category.id}.jpg`}
                    alt={category.name}
                    onError={(e) => {
                      e.target.src = "/images/default-category.png"
                    }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <div className="category-count">20+ sản phẩm</div>
                  <Link to={`/products?category=${category.id}`} className="category-link">
                    Xem tất cả <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <p className="section-subtitle">Những sản phẩm được yêu thích nhất của chúng tôi</p>
          </div>

          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="view-all-link">
            <Link to="/products">
              Xem tất cả sản phẩm <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion Section */}
      <section className="promotion-section">
        <div className="container">
          <div className="promotion-content">
            <h2>Ưu đãi đặc biệt</h2>
            <p>Giảm giá lên đến 50% cho bộ sưu tập mùa hè. Nhanh tay mua ngay trước khi hết hàng!</p>

            <div className="promotion-timer">
              <div className="timer-item">
                <div className="timer-number">{timeLeft.days}</div>
                <div className="timer-label">Ngày</div>
              </div>
              <div className="timer-item">
                <div className="timer-number">{timeLeft.hours}</div>
                <div className="timer-label">Giờ</div>
              </div>
              <div className="timer-item">
                <div className="timer-number">{timeLeft.minutes}</div>
                <div className="timer-label">Phút</div>
              </div>
              <div className="timer-item">
                <div className="timer-number">{timeLeft.seconds}</div>
                <div className="timer-label">Giây</div>
              </div>
            </div>

            <Link to="/products" className="btn-primary">
              <FaShoppingBag style={{ marginRight: "8px" }} /> Mua ngay
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm mới</h2>
            <p className="section-subtitle">Khám phá những sản phẩm mới nhất của chúng tôi</p>
          </div>

          <div className="products-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Đăng ký nhận tin</h2>
            <p className="newsletter-subtitle">Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt từ TTL-Fashion</p>
            <form className="newsletter-form">
              <input type="email" className="newsletter-input" placeholder="Nhập email của bạn" required />
              <button type="submit" className="newsletter-button">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
