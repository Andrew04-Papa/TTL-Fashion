"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext.js"
import "./LoginPage.css"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, currentUser, error } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Nếu đã đăng nhập, chuyển hướng đến trang chủ hoặc trang trước đó
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from || "/"
      navigate(from)
    }
  }, [currentUser, navigate, location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.email.trim()) {
      errors.email = "Vui lòng nhập email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ"
    }

    if (!formData.password) {
      errors.password = "Vui lòng nhập mật khẩu"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      try {
        await login(formData.email, formData.password)
        // Đăng nhập thành công, chuyển hướng sẽ được xử lý bởi useEffect
      } catch (error) {
        // Lỗi đã được xử lý trong AuthContext
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <h1 className="login-title">Đăng nhập</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "form-control error" : "form-control"}
                placeholder="Nhập email của bạn"
              />
              {formErrors.email && <div className="error-message">{formErrors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? "form-control error" : "form-control"}
                placeholder="Nhập mật khẩu của bạn"
              />
              {formErrors.password && <div className="error-message">{formErrors.password}</div>}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
