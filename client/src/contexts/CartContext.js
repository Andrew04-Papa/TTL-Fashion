"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { toast } from "react-toastify"
import api from "../utils/api.js"
import { AuthContext } from "./AuthContext.js"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (currentUser) {
      fetchCart()
    } else {
      // Nếu không đăng nhập, lấy giỏ hàng từ localStorage
      const localCart = localStorage.getItem("cart")
      if (localCart) {
        setCart(JSON.parse(localCart))
      } else {
        setCart({ items: [] })
      }
    }
  }, [currentUser])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await api.get("/cart")
      setCart(response.data.cart)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast.error("Không thể tải giỏ hàng")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true)

      if (currentUser) {
        // Nếu đã đăng nhập, gọi API để thêm vào giỏ hàng
        const response = await api.post("/cart/items", { product_id: productId, quantity })
        await fetchCart() // Tải lại giỏ hàng
        toast.success("Đã thêm sản phẩm vào giỏ hàng")
      } else {
        // Nếu chưa đăng nhập, lưu vào localStorage
        const localCart = { ...cart }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = localCart.items.find((item) => item.id === productId)

        if (existingItem) {
          // Nếu đã có, tăng số lượng
          existingItem.quantity += quantity
        } else {
          // Nếu chưa có, thêm mới
          // Lấy thông tin sản phẩm từ API
          const productResponse = await api.get(`/products/${productId}`)
          const product = productResponse.data.product

          localCart.items.push({
            ...product,
            quantity,
          })
        }

        // Cập nhật state và localStorage
        setCart(localCart)
        localStorage.setItem("cart", JSON.stringify(localCart))
        toast.success("Đã thêm sản phẩm vào giỏ hàng")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error(error.response?.data?.message || "Không thể thêm vào giỏ hàng")
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true)

      if (currentUser) {
        // Nếu đã đăng nhập, gọi API để cập nhật giỏ hàng
        await api.put(`/cart/items/${itemId}`, { quantity })
        await fetchCart() // Tải lại giỏ hàng
      } else {
        // Nếu chưa đăng nhập, cập nhật localStorage
        const localCart = { ...cart }
        const item = localCart.items.find((item) => item.id === itemId)

        if (item) {
          item.quantity = quantity
          setCart(localCart)
          localStorage.setItem("cart", JSON.stringify(localCart))
        }
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
      toast.error("Không thể cập nhật giỏ hàng")
    } finally {
      setLoading(false)
    }
  }

  const removeCartItem = async (itemId) => {
    try {
      setLoading(true)

      if (currentUser) {
        // Nếu đã đăng nhập, gọi API để xóa khỏi giỏ hàng
        await api.delete(`/cart/items/${itemId}`)
        await fetchCart() // Tải lại giỏ hàng
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng")
      } else {
        // Nếu chưa đăng nhập, cập nhật localStorage
        const localCart = { ...cart }
        localCart.items = localCart.items.filter((item) => item.id !== itemId)
        setCart(localCart)
        localStorage.setItem("cart", JSON.stringify(localCart))
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng")
      }
    } catch (error) {
      console.error("Error removing cart item:", error)
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng")
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)

      if (currentUser) {
        // Nếu đã đăng nhập, gọi API để xóa toàn bộ giỏ hàng
        await api.delete("/cart")
        await fetchCart() // Tải lại giỏ hàng
      } else {
        // Nếu chưa đăng nhập, xóa localStorage
        setCart({ items: [] })
        localStorage.removeItem("cart")
      }

      toast.success("Đã xóa giỏ hàng")
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast.error("Không thể xóa giỏ hàng")
    } finally {
      setLoading(false)
    }
  }

  // Tính tổng tiền giỏ hàng
  const calculateTotal = () => {
    return Array.isArray(cart?.items)
      ? cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0
  }

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const calculateItemCount = () => {
    return Array.isArray(cart?.items)
      ? cart.items.reduce((count, item) => count + item.quantity, 0)
      : 0
  }

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    calculateTotal,
    calculateItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
