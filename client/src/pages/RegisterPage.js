"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext.js"
import "./RegisterPage.css"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const { register, currentUser, error } = useContext(AuthContext)
  const navigate = useNavigate()

  // Nếu đã đăng nhập, chuyển hướng đến trang chủ
  useEffect(() => {
    if (currentUser) {
      navigate("/")
    }
  }, [currentUser, navigate])

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

    if (!formData.full_name.trim()) {
      errors.full_name = "Vui lòng nhập họ tên"
    }

    if (!formData.email.trim()) {
      errors.email = "Vui lòng nhập email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ"
    }

    if (!formData.password) {
      errors.password = "Vui lòng nhập mật khẩu"
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      try {
        // Loại bỏ confirmPassword trước khi gửi đến server
        const { confirmPassword, ...userData } = formData
        await register(userData)
        setRegisterSuccess(true)
        // Sau 3 giây, chuyển hướng đến trang đăng nhập
        setTimeout(() => {
          navigate("/login")
        }, 3000)
      } catch (error) {
        // Lỗi đã được xử lý trong AuthContext
        setIsSubmitting(false)
      }
    }
  }

  if (registerSuccess) {
    return (
      <div className="register-page">
        <div className="container">
          <div className="register-success">
            <h2>Đăng ký thành công!</h2>
            <p>Bạn sẽ được chuyển hướng đến trang đăng nhập sau 3 giây...</p>
            <Link to="/login" className="btn-primary">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-container">
          <h1 className="register-title">Đăng ký tài khoản</h1>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="full_name">
                Họ tên <span className="required">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={formErrors.full_name ? "form-control error" : "form-control"}
                placeholder="Nhập họ tên của bạn"
              />
              {formErrors.full_name && <div className="error-message">{formErrors.full_name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
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
              <label htmlFor="password">
                Mật khẩu <span className="required">*</span>
              </label>
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

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={formErrors.confirmPassword ? "form-control error" : "form-control"}
                placeholder="Nhập lại mật khẩu của bạn"
              />
              {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={formErrors.phone ? "form-control error" : "form-control"}
                placeholder="Nhập số điện thoại của bạn"
              />
              {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập địa chỉ của bạn"
                rows="3"
              ></textarea>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn-register" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
