-- Thêm dữ liệu mẫu cho bảng users
INSERT INTO users (full_name, email, password, phone, address, role) VALUES
('Admin User', 'admin@ttlfashion.com', '$2b$10$X7VYHy.uAWH876ZzVNFvB.Rr.YSF8WxHYzV0jq1Nm7.NkrVUvTKdW', '0987654321', 'Hà Nội', 'admin'),
('John Doe', 'john@example.com', '$2b$10$X7VYHy.uAWH876ZzVNFvB.Rr.YSF8WxHYzV0jq1Nm7.NkrVUvTKdW', '0123456789', '123 Fashion St, Hồ Chí Minh', 'customer'),
('Jane Smith', 'jane@example.com', '$2b$10$X7VYHy.uAWH876ZzVNFvB.Rr.YSF8WxHYzV0jq1Nm7.NkrVUvTKdW', '0123456788', '456 Style Ave, Đà Nẵng', 'customer');

-- Thêm dữ liệu mẫu cho bảng categories
INSERT INTO categories (name, description) VALUES
('Men', 'Thời trang nam'),
('Women', 'Thời trang nữ'),
('Accessories', 'Phụ kiện thời trang'),
('Footwear', 'Giày dép');

-- Thêm dữ liệu mẫu cho bảng products
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity) VALUES
('Áo Thun Nam Basic', 'Áo thun nam chất liệu cotton 100%, thoáng mát', 199000, 'https://example.com/images/products/tshirt-black.jpg', 1, 100),
('Áo Sơ Mi Nam Dài Tay', 'Áo sơ mi nam dài tay chất liệu linen cao cấp', 349000, 'https://example.com/images/products/shirt-white.jpg', 1, 80),
('Quần Jeans Nam Slim Fit', 'Quần jeans nam form slim fit, màu xanh đậm', 499000, 'https://example.com/images/products/jeans-blue.jpg', 1, 50),
('Đầm Maxi Nữ', 'Đầm maxi nữ dáng suông, họa tiết hoa', 599000, 'https://example.com/images/products/dress-floral.jpg', 2, 40),
('Áo Blouse Nữ', 'Áo blouse nữ tay phồng, màu trắng', 399000, 'https://example.com/images/products/blouse-white.jpg', 2, 60),
('Chân Váy Midi', 'Chân váy midi xếp ly, màu đen', 449000, 'https://example.com/images/products/skirt-black.jpg', 2, 45),
('Túi Xách Nữ', 'Túi xách nữ da PU cao cấp, màu nâu', 699000, 'https://example.com/images/products/bag-brown.jpg', 3, 30),
('Dây Chuyền Bạc', 'Dây chuyền bạc 925, thiết kế đơn giản', 299000, 'https://example.com/images/products/necklace-silver.jpg', 3, 25),
('Giày Sneaker Nam', 'Giày sneaker nam màu trắng, đế cao su', 799000, 'https://example.com/images/products/sneaker-white.jpg', 4, 35),
('Giày Cao Gót Nữ', 'Giày cao gót nữ 7cm, màu đen', 599000, 'https://example.com/images/products/heels-black.jpg', 4, 40);

-- Tạo giỏ hàng cho người dùng
INSERT INTO carts (user_id) VALUES
(2),
(3);

-- Thêm sản phẩm vào giỏ hàng
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 5, 1),
(2, 7, 1);

-- Thêm đơn hàng mẫu
INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES
(2, 1047000, 'Completed', '123 Fashion St, Hồ Chí Minh'),
(3, 998000, 'Processing', '456 Style Ave, Đà Nẵng'),
(2, 799000, 'Pending', '123 Fashion St, Hồ Chí Minh');

-- Thêm chi tiết đơn hàng
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 199000),
(1, 3, 1, 499000),
(1, 8, 1, 299000),
(2, 5, 1, 399000),
(2, 7, 1, 599000),
(3, 9, 1, 799000);

-- Thêm mã giảm giá
INSERT INTO discount_codes (code, discount_percent, expiration_date) VALUES
('SUMMER2023', 10, '2023-12-31'),
('WELCOME20', 20, '2023-12-31'),
('FLASH30', 30, '2023-08-31');
