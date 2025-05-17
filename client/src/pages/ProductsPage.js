"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa"
import ProductCard from "../components/product/ProductCard.js"
import api from "../utils/api.js"
import "./ProductsPage.css"

const ProductsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true) // State để kiểm soát hiển thị bộ lọc

  // Lấy từ khóa tìm kiếm từ URL nếu có
  const searchFromUrl = searchParams.get("search") || ""

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchFromUrl,
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  })

  // Đồng bộ searchTerm với từ khóa tìm kiếm từ URL
  const [searchTerm, setSearchTerm] = useState(searchFromUrl)

  useEffect(() => {
    // Cập nhật searchTerm khi URL thay đổi
    setSearchTerm(searchParams.get("search") || "")

    // Cập nhật filters.search khi URL thay đổi
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get("search") || "",
    }))

    fetchData()
  }, [searchParams])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Lấy danh sách danh mục
      const categoriesResponse = await api.get("/products/categories")
      setCategories(categoriesResponse.data.categories)

      let productsResponse

      // Nếu có từ khóa tìm kiếm, sử dụng endpoint search
      if (filters.search) {
        productsResponse = await api.get(`/products/search?q=${filters.search}`)
      } else {
        // Xây dựng query params cho trường hợp không tìm kiếm
        let url = "/products?limit=100"

        if (filters.category) {
          url += `&category=${filters.category}`
        }

        // Lấy danh sách sản phẩm
        productsResponse = await api.get(url)
      }

      let filteredProducts = productsResponse.data.products

      // Lọc theo giá
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter((product) => product.price >= Number(filters.minPrice))
      }

      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter((product) => product.price <= Number(filters.maxPrice))
      }

      // Sắp xếp sản phẩm
      switch (filters.sort) {
        case "price-asc":
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case "name-asc":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
          break
        default: // newest
          filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }

      setProducts(filteredProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()

    // Cập nhật URL với từ khóa tìm kiếm
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }

    // Cập nhật filters
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }))

    // Cập nhật URL
    navigate(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    })
    setSearchTerm("")

    // Xóa tất cả tham số tìm kiếm khỏi URL
    navigate("/products")
  }

  const applyFilters = () => {
    // Cập nhật URL với các bộ lọc
    const params = new URLSearchParams()

    if (filters.category) params.set("category", filters.category)
    if (searchTerm) params.set("search", searchTerm)
    if (filters.sort !== "newest") params.set("sort", filters.sort)

    // Cập nhật URL
    navigate(`/products?${params.toString()}`)

    // Gọi fetchData để lấy dữ liệu mới
    fetchData()
  }

  // Hàm để ẩn/hiện bộ lọc
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Sản phẩm</h1>

        <div className="products-toolbar">
          <button className="filter-button" onClick={toggleFilters}>
            <FaFilter /> Bộ lọc {showFilters ? <FaTimes className="filter-icon-close" /> : null}
          </button>

          <div className="sort-container">
            <label>Sắp xếp:</label>
            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="name-asc">Tên: A-Z</option>
              <option value="name-desc">Tên: Z-A</option>
            </select>
          </div>
        </div>

        <div className="products-container">
          {/* Thêm class hidden khi showFilters = false */}
          <div className={`filters-sidebar ${showFilters ? "" : "hidden"}`}>
            <div className="filters-header">
              <h3>Bộ lọc</h3>
              <button className="clear-filters" onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            </div>

            <div className="filter-group">
              <h4>Danh mục</h4>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <h4>Giá</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Giá thấp nhất"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span>-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Giá cao nhất"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-group">
              <h4>Tìm kiếm</h4>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSearch(e)
                    }
                  }}
                />
                <button onClick={handleSearch} className="search-button">
                  <FaSearch />
                </button>
              </div>
            </div>

            <button className="apply-button" onClick={applyFilters}>
              Áp dụng
            </button>
          </div>

          {/* Điều chỉnh chiều rộng của products-content khi ẩn bộ lọc */}
          <div className={`products-content ${showFilters ? "" : "full-width"}`}>
            <div className="products-count">{products.length} sản phẩm</div>

            {products.length === 0 ? (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                <button className="clear-button" onClick={clearFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
