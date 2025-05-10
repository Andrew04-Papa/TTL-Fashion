"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa"
import ProductCard from "../components/product/ProductCard.js"
import api from "../utils/api.js"
import "./HomePage.css"

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const featuredResponse = await api.get("/products?limit=4")
        setFeaturedProducts(featuredResponse?.data?.products || [])

        const newProductsResponse = await api.get("/products?limit=8")
        setNewProducts(newProductsResponse?.data?.products || [])

        const categoriesResponse = await api.get("/products/categories")
        setCategories(categoriesResponse?.data?.categories || [])
      } catch (error) {
        console.error("Error fetching data from API:", error)

        setFeaturedProducts([
          { id: 1, name: "Áo thun nữ", price: 250000, category_name: "Nữ", image_url: "/images/category-1.jpg" },
          { id: 2, name: "Áo sơ mi nam", price: 320000, category_name: "Nam", image_url: "/images/category-2.jpg" }
        ])

        setNewProducts([
          { id: 3, name: "Túi đeo chéo", price: 150000, category_name: "Phụ kiện", image_url: "/images/category-3.jpg" },
          { id: 4, name: "Giày sneaker", price: 450000, category_name: "Giày dép", image_url: "/images/category-4.jpg" }
        ])

        setCategories([
          { id: 1, name: "Thời trang nữ" },
          { id: 2, name: "Thời trang nam" },
          { id: 3, name: "Phụ kiện" },
          { id: 4, name: "Giày dép" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Thời trang cho mọi phong cách</h1>
            <p>Khám phá bộ sưu tập mới nhất với các thiết kế độc đáo và chất lượng cao</p>
            <Link to="/products" className="btn-primary">
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div className="category-card" key={category.id}>
                <div className="category-image">
                  <img
                    src={`/images/category-${category.id}.jpg`}
                    alt={category.name}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/images/default-category.png"
                    }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <Link to={`/products?category=${category.id}`} className="category-link">
                    Xem sản phẩm <FaArrowRight />
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
          <h2 className="section-title">Sản phẩm nổi bật</h2>
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

      {/* New Arrivals Section */}
      <section className="new-arrivals-section">
        <div className="container">
          <h2 className="section-title">Sản phẩm mới</h2>
          <div className="products-grid">
            {newProducts.map((product) => (
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

      {/* Promotion Banner */}
      <section className="promotion-section">
        <div className="container">
          <div className="promotion-content">
            <h2>Giảm giá lên đến 30%</h2>
            <p>Cho tất cả sản phẩm mới trong bộ sưu tập mùa hè</p>
            <Link to="/products" className="btn-secondary">
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
