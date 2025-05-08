-- Index cho tìm kiếm sản phẩm theo tên
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON products USING gin(to_tsvector('english', description));

-- Index cho tìm kiếm người dùng theo email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index cho lọc đơn hàng theo trạng thái
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index cho lọc sản phẩm theo giá
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Index cho lọc sản phẩm theo số lượng tồn kho
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- Index cho lọc đơn hàng theo ngày tạo
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Index cho mã giảm giá
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expiration ON discount_codes(expiration_date);
