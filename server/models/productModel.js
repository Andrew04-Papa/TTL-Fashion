import { query } from "../db/index.js"

export const getAllProducts = async (limit = 10, offset = 0, categoryId = null) => {
  let sql = `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `

  const params = []

  if (categoryId) {
    sql += " WHERE p.category_id = $1"
    params.push(categoryId)
  }

  sql += " ORDER BY p.created_at DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2)
  params.push(limit, offset)

  const result = await query(sql, params)
  return result.rows
}

export const getProductById = async (id) => {
  const result = await query(
    `
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `,
    [id],
  )

  return result.rows[0]
}

export const createProduct = async (productData) => {
  const { name, description, price, image_url, category_id, stock_quantity } = productData

  const result = await query(
    "INSERT INTO products (name, description, price, image_url, category_id, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, description, price, image_url, category_id, stock_quantity],
  )

  return result.rows[0]
}

export const updateProduct = async (id, productData) => {
  const { name, description, price, image_url, category_id, stock_quantity } = productData

  const result = await query(
    "UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category_id = $5, stock_quantity = $6 WHERE id = $7 RETURNING *",
    [name, description, price, image_url, category_id, stock_quantity, id],
  )

  return result.rows[0]
}

export const deleteProduct = async (id) => {
  const result = await query("DELETE FROM products WHERE id = $1 RETURNING *", [id])
  return result.rows[0]
}

export const searchProducts = async (searchTerm) => {
  const result = await query(
    `SELECT p.*, c.name as category_name 
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.name ILIKE $1 OR p.description ILIKE $1`,
    [`%${searchTerm}%`],
  )

  return result.rows
}

export const getAllCategories = async () => {
  const result = await query("SELECT * FROM categories")
  return result.rows
}

export const getCategoryById = async (id) => {
  const result = await query("SELECT * FROM categories WHERE id = $1", [id])
  return result.rows[0]
}

export const createCategory = async (name, description) => {
  const result = await query("INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *", [
    name,
    description,
  ])

  return result.rows[0]
}

export const updateCategory = async (id, name, description) => {
  const result = await query("UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *", [
    name,
    description,
    id,
  ])

  return result.rows[0]
}

export const deleteCategory = async (id) => {
  const result = await query("DELETE FROM categories WHERE id = $1 RETURNING *", [id])
  return result.rows[0]
}

export const updateStock = async (productId, quantity) => {
  const result = await query(
    "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1 RETURNING *",
    [quantity, productId],
  )

  return result.rows[0]
}
