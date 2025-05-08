import { query } from "../db/index.js"

export const getAllDiscounts = async () => {
  const result = await query("SELECT * FROM discount_codes ORDER BY expiration_date DESC")

  return result.rows
}

export const getDiscountByCode = async (code) => {
  const result = await query("SELECT * FROM discount_codes WHERE code = $1", [code])

  return result.rows[0]
}

export const createDiscount = async (discountData) => {
  const { code, discount_percent, expiration_date } = discountData

  const result = await query(
    "INSERT INTO discount_codes (code, discount_percent, expiration_date) VALUES ($1, $2, $3) RETURNING *",
    [code, discount_percent, expiration_date],
  )

  return result.rows[0]
}

export const updateDiscount = async (id, discountData) => {
  const { code, discount_percent, expiration_date } = discountData

  const result = await query(
    "UPDATE discount_codes SET code = $1, discount_percent = $2, expiration_date = $3 WHERE id = $4 RETURNING *",
    [code, discount_percent, expiration_date, id],
  )

  return result.rows[0]
}

export const deleteDiscount = async (id) => {
  const result = await query("DELETE FROM discount_codes WHERE id = $1 RETURNING *", [id])

  return result.rows[0]
}

export const validateDiscount = async (code) => {
  const result = await query("SELECT * FROM discount_codes WHERE code = $1 AND expiration_date >= CURRENT_DATE", [code])

  return result.rows[0]
}
