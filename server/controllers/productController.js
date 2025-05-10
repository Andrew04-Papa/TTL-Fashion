import * as productModel from "../models/productModel.js"

// Lấy danh sách sản phẩm
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, category } = req.query
    const offset = (page - 1) * limit

    const products = await productModel.getAllProducts(
      Number.parseInt(limit),
      Number.parseInt(offset),
      category ? Number.parseInt(category) : null,
    )

    res.status(200).json({ products })
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Lấy thông tin chi tiết sản phẩm
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
    }

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Lỗi lấy thông tin sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// Tìm kiếm sản phẩm
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" })
    }

    const products = await productModel.searchProducts(q)

    res.status(200).json({ products })
  } catch (error) {
    console.error("Lỗi tìm kiếm sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Admin: Thêm sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, category_id, stock_quantity } = req.body

    const newProduct = await productModel.createProduct({
      name,
      description,
      price,
      image_url,
      category_id,
      stock_quantity,
    })

    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product: newProduct,
    })
  } catch (error) {
    console.error("Lỗi thêm sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Admin: Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, image_url, category_id, stock_quantity } = req.body

    const updatedProduct = await productModel.updateProduct(id, {
      name,
      description,
      price,
      image_url,
      category_id,
      stock_quantity,
    })

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
    }

    res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Admin: Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const deletedProduct = await productModel.deleteProduct(id)
    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
    }

    res.status(200).json({
      message: "Xóa sản phẩm thành công",
      product: deletedProduct,
    })
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Lấy danh sách danh mục
export const getCategories = async (req, res) => {
  try {
    console.log("✅ Gọi getCategories");
    const categories = await productModel.getAllCategories();
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Lỗi lấy danh sách danh mục:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// Lấy thông tin chi tiết danh mục
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params

    const category = await productModel.getCategoryById(id)
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" })
    }

    res.status(200).json({ category })
  } catch (error) {
    console.error("Lỗi lấy thông tin danh mục:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Admin: Thêm danh mục mới
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body

    const newCategory = await productModel.createCategory(name, description)

    res.status(201).json({
      message: "Thêm danh mục thành công",
      category: newCategory,
    })
  } catch (error) {
    console.error("Lỗi thêm danh mục:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Admin: Cập nhật danh mục
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const updatedCategory = await productModel.updateCategory(id, name, description)

    if (!updatedCategory) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" })
    }

    res.status(200).json({
      message: "Cập nhật danh mục thành công",
      category: updatedCategory,
    })
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}

// Admin: Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const deletedCategory = await productModel.deleteCategory(id)
    if (!deletedCategory) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" })
    }

    res.status(200).json({
      message: "Xóa danh mục thành công",
      category: deletedCategory,
    })
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error)
    res.status(500).json({ message: "Lỗi server" })
  }
}
