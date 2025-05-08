"use client"

import { createContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import api from "../utils/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const token = localStorage.getItem("token")
    if (token) {
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me")
      setCurrentUser(response.data.user)
    } catch (error) {
      console.error("Error fetching current user:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.post("/users/login", { email, password })
      const { token, user } = response.data

      // Lưu token vào localStorage
      localStorage.setItem("token", token)

      // Cập nhật state
      setCurrentUser(user)

      // Thông báo thành công
      toast.success("Đăng nhập thành công!")

      return user
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại"
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.post("/users/register", userData)

      // Thông báo thành công
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.")

      return response.data
    } catch (error) {
      console.error("Register error:", error)
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại"
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token")

    // Cập nhật state
    setCurrentUser(null)

    // Thông báo thành công
    toast.info("Đã đăng xuất")
  }

  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.put("/users/me", userData)

      // Cập nhật state
      setCurrentUser(response.data.user)

      // Thông báo thành công
      toast.success("Cập nhật thông tin thành công!")

      return response.data.user
    } catch (error) {
      console.error("Update profile error:", error)
      const errorMessage = error.response?.data?.message || "Cập nhật thông tin thất bại"
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      setError(null)
      await api.put("/users/change-password", { currentPassword, newPassword })

      // Thông báo thành công
      toast.success("Đổi mật khẩu thành công!")
    } catch (error) {
      console.error("Change password error:", error)
      const errorMessage = error.response?.data?.message || "Đổi mật khẩu thất bại"
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAdmin: currentUser?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
