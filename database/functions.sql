-- Hàm lấy tổng doanh thu theo tháng
CREATE OR REPLACE FUNCTION get_monthly_revenue(year_param INT)
RETURNS TABLE (
    month INT,
    revenue DECIMAL(12, 2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(MONTH FROM created_at)::INT AS month,
        SUM(total_amount) AS revenue
    FROM 
        orders
    WHERE 
        EXTRACT(YEAR FROM created_at) = year_param
        AND status = 'Completed'
    GROUP BY 
        EXTRACT(MONTH FROM created_at)
    ORDER BY 
        month;
END;
$$ LANGUAGE plpgsql;

-- Hàm lấy sản phẩm bán chạy nhất
CREATE OR REPLACE FUNCTION get_best_selling_products(limit_param INT)
RETURNS TABLE (
    product_id INT,
    product_name VARCHAR(255),
    total_sold INT,
    revenue DECIMAL(12, 2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS product_id,
        p.name AS product_name,
        SUM(oi.quantity)::INT AS total_sold,
        SUM(oi.quantity * oi.price) AS revenue
    FROM 
        order_items oi
    JOIN 
        products p ON oi.product_id = p.id
    JOIN 
        orders o ON oi.order_id = o.id
    WHERE 
        o.status = 'Completed'
    GROUP BY 
        p.id, p.name
    ORDER BY 
        total_sold DESC
    LIMIT 
        limit_param;
END;
$$ LANGUAGE plpgsql;

-- Hàm lấy thông tin đơn hàng đầy đủ
CREATE OR REPLACE FUNCTION get_order_details(order_id_param INT)
RETURNS TABLE (
    order_id INT,
    user_id INT,
    user_name VARCHAR(100),
    user_email VARCHAR(100),
    total_amount DECIMAL(10, 2),
    status VARCHAR(50),
    created_at TIMESTAMP,
    shipping_address TEXT,
    product_id INT,
    product_name VARCHAR(255),
    quantity INT,
    price DECIMAL(10, 2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id AS order_id,
        o.user_id,
        u.full_name AS user_name,
        u.email AS user_email,
        o.total_amount,
        o.status,
        o.created_at,
        o.shipping_address,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        oi.price
    FROM 
        orders o
    JOIN 
        users u ON o.user_id = u.id
    JOIN 
        order_items oi ON o.id = oi.order_id
    JOIN 
        products p ON oi.product_id = p.id
    WHERE 
        o.id = order_id_param;
END;
$$ LANGUAGE plpgsql;

-- Trigger để cập nhật số lượng tồn kho khi đơn hàng bị hủy
CREATE OR REPLACE FUNCTION restore_stock_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != 'Cancelled' AND NEW.status = 'Cancelled' THEN
        UPDATE products p
        SET stock_quantity = p.stock_quantity + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_cancel_trigger
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (OLD.status != 'Cancelled' AND NEW.status = 'Cancelled')
EXECUTE FUNCTION restore_stock_on_cancel();
