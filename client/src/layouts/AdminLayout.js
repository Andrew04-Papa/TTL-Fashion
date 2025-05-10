"use client"

import { useState } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import {
  FaTachometerAlt,
  FaBox,
  FaList,
  FaShoppingCart,
  FaUsers,
  FaTags,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa"
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext.js"
import "./AdminLayout.css"

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="admin-layout">
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>TTL-Fashion</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li>
              <Link to="/admin">
                <FaTachometerAlt />
                <span>Tổng quan</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/products">
                <FaBox />
                <span>Sản phẩm</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/categories">
                <FaList />
                <span>Danh mục</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/orders">
                <FaShoppingCart />
                <span>Đơn hàng</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <FaUsers />
                <span>Người dùng</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/discounts">
                <FaTags />
                <span>Mã giảm giá</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
      <div className={`admin-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="admin-header">
          <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className="admin-header-right">
            <Link to="/" className="view-site-link">
              Xem trang web
            </Link>
          </div>
        </div>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
