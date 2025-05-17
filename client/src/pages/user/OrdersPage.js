"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { FaEye, FaSearch } from "react-icons/fa"
import { AuthContext } from "../../contexts/AuthContext.js"
import { formatCurrency, formatDate } from "../../utils/format.js"
import api from "../../utils/api.js"
import "./OrdersPage.css"

const OrdersPage = () => {
  const { currentUser } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({
    status: "",
    search: "",
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await api.get("/orders/my-orders")
        setOrders(response.data.orders)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("Không thể tải danh sách đơn hàng")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchOrders()
    }
  }, [currentUser])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter({
      ...filter,
      [name]: value,
    })
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending"
      case "Processing":
        return "status-processing"
      case "Shipped":
        return "status-shipped"
      case "Delivered":
        return "status-delivered"
      case "Cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xác nhận"
      case "Processing":
        return "Đang xử lý"
      case "Shipped":
        return "Đang giao hàng"
      case "Delivered":
        return "Đã giao hàng"
      case "Cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  const filteredOrders = orders.filter((order) => {
    // Lọc theo trạng thái
    if (filter.status && order.status !== filter.status) {
      return false
    }

    // Lọc theo từ khóa tìm kiếm (mã đơn hàng)
    if (filter.search && !order.id.toString().includes(filter.search)) {
      return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">Lịch sử đơn hàng</h1>

        <div className="orders-filter">
          <div className="filter-group">
            <select name="status" value={filter.status} onChange={handleFilterChange} className="filter-select">
              <option value="">Tất cả trạng thái</option>
              <option value="Pending">Chờ xác nhận</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Shipped">Đang giao hàng</option>
              <option value="Delivered">Đã giao hàng</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Tìm theo mã đơn hàng"
              className="filter-input"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>Không tìm thấy đơn hàng nào</p>
            <Link to="/products" className="btn-shop">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td className="price-cell">{formatCurrency(order.total_amount)}</td>
                    <td>
                      <span className={`order-status ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      <Link to={`/orders/${order.id}`} className="btn-view-order">
                        <FaEye />
                        <span>Chi tiết</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
