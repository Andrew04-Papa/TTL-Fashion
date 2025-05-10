"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from "react-icons/fa"
import { AuthContext } from "../../contexts/AuthContext.js"
import { CartContext } from "../../contexts/CartContext.js"
import "./Header.css"

const Header = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext)
  const { calculateItemCount } = useContext(CartContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`)
      setSearchTerm("")
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">TTL-Fashion</Link>
          </div>

          <div className="mobile-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <ul>
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>

          <div className={`header-actions ${isMenuOpen ? "active" : ""}`}>
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <FaSearch />
              </button>
            </form>

            <div className="cart-icon">
              <Link to="/cart">
                <FaShoppingCart />
                {calculateItemCount() > 0 && <span className="cart-count">{calculateItemCount()}</span>}
              </Link>
            </div>

            <div className="user-menu">
              {currentUser ? (
                <div className="dropdown">
                  <button className="dropdown-toggle">
                    <FaUser />
                    <span>{currentUser.full_name}</span>
                  </button>
                  <div className="dropdown-menu">
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        Quản trị
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      Tài khoản
                    </Link>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                      Đơn hàng
                    </Link>
                    <button onClick={handleLogout}>Đăng xuất</button>
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="btn-register" onClick={() => setIsMenuOpen(false)}>
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
