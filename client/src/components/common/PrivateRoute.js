"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext.js"

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute
