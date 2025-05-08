// Hàm định dạng tiền tệ
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

// Hàm tạo mã đơn hàng ngẫu nhiên
export const generateOrderCode = () => {
  const prefix = "TTL"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}${timestamp}${random}`
}

// Hàm kiểm tra email hợp lệ
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Hàm kiểm tra số điện thoại hợp lệ
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
  return phoneRegex.test(phone)
}

// Hàm tạo slug từ tên sản phẩm
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
}

// Hàm phân trang
export const paginate = (items, page = 1, limit = 10) => {
  const offset = (page - 1) * limit
  const totalPages = Math.ceil(items.length / limit)
  const paginatedItems = items.slice(offset, offset + limit)

  return {
    page,
    limit,
    totalItems: items.length,
    totalPages,
    data: paginatedItems,
  }
}

// Hàm lọc dữ liệu nhạy cảm
export const sanitizeUser = (user) => {
  if (!user) return null

  const { password, ...sanitizedUser } = user
  return sanitizedUser
}
