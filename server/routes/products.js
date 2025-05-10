import express from "express"
import * as productController from "../controllers/productController.js"
import { authenticate, isAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Route công khai
router.get("/", productController.getProducts)
router.get("/search", productController.searchProducts)

// ✅ Đặt route cụ thể trước
router.get("/categories", productController.getCategories)
router.get("/categories/:id", productController.getCategoryById)

// ❗ Đặt route động sau cùng (và bỏ trùng)
router.get("/:id", productController.getProductById)

// Route yêu cầu quyền admin
router.post("/", authenticate, isAdmin, productController.createProduct)
router.put("/:id", authenticate, isAdmin, productController.updateProduct)
router.delete("/:id", authenticate, isAdmin, productController.deleteProduct)

// Route danh mục yêu cầu quyền admin
router.post("/categories", authenticate, isAdmin, productController.createCategory)
router.put("/categories/:id", authenticate, isAdmin, productController.updateCategory)
router.delete("/categories/:id", authenticate, isAdmin, productController.deleteCategory)

export default router
