import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "./contexts/AuthContext.js"
import { CartProvider } from "./contexts/CartContext.js"
import PrivateRoute from "./components/common/PrivateRoute.js"
import AdminRoute from "./components/common/AdminRoute.js"

// Layouts
import MainLayout from "./layouts/MainLayout.js"
import AdminLayout from "./layouts/AdminLayout.js"

// Pages
import HomePage from "./pages/HomePage.js"
import ProductsPage from "./pages/ProductsPage.js"
import ProductDetailPage from "./pages/ProductDetailPage.js"
import LoginPage from "./pages/LoginPage.js"
import RegisterPage from "./pages/RegisterPage.js"
import CartPage from "./pages/CartPage.js"
import CheckoutPage from "./pages/CheckoutPage.js"
import OrderSuccessPage from "./pages/OrderSuccessPage.js"
import AboutPage from "./pages/AboutPage.js"
import ContactPage from "./pages/ContactPage.js"


// User Pages
import ProfilePage from "./pages/user/ProfilePage.js"
import OrdersPage from "./pages/user/OrdersPage.js"
import OrderDetailPage from "./pages/user/OrderDetailPage.js"

// Admin Pages
import AdminDashboard from "./pages/admin/DashboardPage.js"
import AdminProducts from "./pages/admin/ProductsPage.js"
import AdminCategories from "./pages/admin/CategoriesPage.js"
import AdminOrders from "./pages/admin/OrdersPage.js"
import AdminUsers from "./pages/admin/UsersPage.js"
import AdminDiscounts from "./pages/admin/DiscountsPage.js"

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route
                path="checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="order-success"
                element={
                  <PrivateRoute>
                    <OrderSuccessPage />
                  </PrivateRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <PrivateRoute>
                    <OrdersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="orders/:id"
                element={
                  <PrivateRoute>
                    <OrderDetailPage />
                  </PrivateRoute>
                }
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="discounts" element={<AdminDiscounts />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
