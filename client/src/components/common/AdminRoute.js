"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext.js"

const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useContext(AuthContext)

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute
