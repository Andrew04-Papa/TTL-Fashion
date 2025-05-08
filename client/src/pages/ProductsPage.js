"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { FaFilter, FaTimes } from "react-icons/fa"
import ProductCard from "../components/product/ProductCard"
import api from "../utils/api"
import "./ProductsPage.css"

const ProductsPage = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Lấy danh sách danh mục
        const categoriesResponse = await api.get("/products/categories")
        setCategories(categoriesResponse.data.categories)

        // Xây dựng query params
        let url = "/products?limit=100"

        if (filters.category) {
          url += `&category=${filters.category}`
        }

        if (filters.search) {
          url += `&search=${filters.search}`
        }

        // Lấy danh sách sản phẩm
        const productsResponse = await api.get(url)
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

    fetchData()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    })
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Sản phẩm</h1>

        <div className="filter-toggle" onClick={toggleFilter}>
          <FaFilter />
          <span>Lọc sản phẩm</span>
        </div>

        <div className="products-container">
          <div className={`filters-sidebar ${isFilterOpen ? "open" : ""}`}>
            <div className="filters-header">
              <h3>Bộ lọc</h3>
              <button className="close-filters" onClick={toggleFilter}>
                <FaTimes />
              </button>
            </div>

            <div className="filter-group">
              <h4>Danh mục</h4>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-select">
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
                  className="filter-input"
                />
                <span>-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Giá cao nhất"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <h4>Tìm kiếm</h4>
              <input
                type="text"
                name="search"
                placeholder="Tên sản phẩm..."
                value={filters.search}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          </div>

          <div className="products-content">
            <div className="products-header">
              <div className="products-count">{products.length} sản phẩm</div>
              <div className="products-sort">
                <label>Sắp xếp:</label>
                <select name="sort" value={filters.sort} onChange={handleFilterChange} className="sort-select">
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                <button className="btn-primary" onClick={clearFilters}>
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
