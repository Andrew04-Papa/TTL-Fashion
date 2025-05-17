import axios from "axios"

// Sử dụng biến môi trường hoặc mặc định là localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Thêm interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token và chuyển hướng đến trang đăng nhập
      localStorage.removeItem("token")

      // Nếu không phải ở trang đăng nhập hoặc đăng ký, chuyển hướng
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api
