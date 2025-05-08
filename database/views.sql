-- View hiển thị thông tin sản phẩm đầy đủ
CREATE OR REPLACE VIEW product_details AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.image_url,
    p.stock_quantity,
    p.created_at,
    c.id AS category_id,
    c.name AS category_name,
    c.description AS category_description
FROM 
    products p
LEFT JOIN 
    categories c ON p.category_id = c.id;

-- View hiển thị thông tin đơn hàng tổng hợp
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.user_id,
    u.full_name AS user_name,
    u.email AS user_email,
    o.total_amount,
    o.status,
    o.created_at,
    o.shipping_address,
    COUNT(oi.id) AS total_items,
    SUM(oi.quantity) AS total_quantity
FROM 
    orders o
JOIN 
    users u ON o.user_id = u.id
JOIN 
    order_items oi ON o.id = oi.order_id
GROUP BY 
    o.id, u.full_name, u.email;

-- View hiển thị thông tin người dùng an toàn (không có mật khẩu)
CREATE OR REPLACE VIEW user_safe_info AS
SELECT 
    id,
    full_name,
    email,
    phone,
    address,
    role,
    created_at
FROM 
    users;

-- View hiển thị thống kê bán hàng theo danh mục
CREATE OR REPLACE VIEW category_sales AS
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(oi.quantity) AS total_items_sold,
    SUM(oi.quantity * oi.price) AS total_revenue
FROM 
    categories c
JOIN 
    products p ON c.id = p.category_id
JOIN 
    order_items oi ON p.id = oi.product_id
JOIN 
    orders o ON oi.order_id = o.id
WHERE 
    o.status = 'Completed'
GROUP BY 
    c.id, c.name;
