-- Thủ tục tạo đơn hàng mới
CREATE OR REPLACE PROCEDURE create_order(
    user_id_param INT,
    shipping_address_param TEXT,
    discount_code_param VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    cart_id_var INT;
    cart_items_cursor CURSOR FOR 
        SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = cart_id_var;
    total_amount_var DECIMAL(10, 2) := 0;
    discount_percent_var INT := 0;
    new_order_id INT;
    product_id_var INT;
    quantity_var INT;
    price_var DECIMAL(10, 2);
    stock_quantity_var INT;
BEGIN
    -- Lấy ID giỏ hàng của người dùng
    SELECT id INTO cart_id_var FROM carts WHERE user_id = user_id_param;
    
    -- Kiểm tra giỏ hàng có tồn tại không
    IF cart_id_var IS NULL THEN
        RAISE EXCEPTION 'Giỏ hàng không tồn tại';
    END IF;
    
    -- Kiểm tra giỏ hàng có sản phẩm không
    IF NOT EXISTS (SELECT 1 FROM cart_items WHERE cart_id = cart_id_var) THEN
        RAISE EXCEPTION 'Giỏ hàng trống';
    END IF;
    
    -- Kiểm tra mã giảm giá nếu có
    IF discount_code_param IS NOT NULL THEN
        SELECT discount_percent INTO discount_percent_var
        FROM discount_codes
        WHERE code = discount_code_param AND expiration_date >= CURRENT_DATE;
    END IF;
    
    -- Tính tổng tiền
    SELECT SUM(ci.quantity * p.price) INTO total_amount_var
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = cart_id_var;
    
    -- Áp dụng giảm giá nếu có
    IF discount_percent_var > 0 THEN
        total_amount_var := total_amount_var * (1 - discount_percent_var / 100.0);
    END IF;
    
    -- Tạo đơn hàng mới
    INSERT INTO orders (user_id, total_amount, shipping_address)
    VALUES (user_id_param, total_amount_var, shipping_address_param)
    RETURNING id INTO new_order_id;
    
    -- Thêm chi tiết đơn hàng và cập nhật số lượng tồn kho
    FOR product_record IN cart_items_cursor LOOP
        product_id_var := product_record.product_id;
        quantity_var := product_record.quantity;
        price_var := product_record.price;
        stock_quantity_var := product_record.stock_quantity;
        
        -- Kiểm tra số lượng tồn kho
        IF stock_quantity_var < quantity_var THEN
            RAISE EXCEPTION 'Sản phẩm ID % không đủ số lượng trong kho', product_id_var;
        END IF;
        
        -- Thêm chi tiết đơn hàng
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (new_order_id, product_id_var, quantity_var, price_var);
        
        -- Cập nhật số lượng tồn kho
        UPDATE products
        SET stock_quantity = stock_quantity - quantity_var
        WHERE id = product_id_var;
    END LOOP;
    
    -- Xóa sản phẩm trong giỏ hàng
    DELETE FROM cart_items WHERE cart_id = cart_id_var;
    
    COMMIT;
END;
$$;

-- Thủ tục cập nhật trạng thái đơn hàng
CREATE OR REPLACE PROCEDURE update_order_status(
    order_id_param INT,
    new_status_param VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra đơn hàng có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM orders WHERE id = order_id_param) THEN
        RAISE EXCEPTION 'Đơn hàng không tồn tại';
    END IF;
    
    -- Kiểm tra trạng thái hợp lệ
    IF new_status_param NOT IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') THEN
        RAISE EXCEPTION 'Trạng thái đơn hàng không hợp lệ';
    END IF;
    
    -- Cập nhật trạng thái đơn hàng
    UPDATE orders
    SET status = new_status_param
    WHERE id = order_id_param;
    
    COMMIT;
END;
$$;

-- Thủ tục tạo mã giảm giá mới
CREATE OR REPLACE PROCEDURE create_discount_code(
    code_param VARCHAR,
    discount_percent_param INT,
    expiration_date_param DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Kiểm tra mã giảm giá đã tồn tại chưa
    IF EXISTS (SELECT 1 FROM discount_codes WHERE code = code_param) THEN
        RAISE EXCEPTION 'Mã giảm giá đã tồn tại';
    END IF;
    
    -- Kiểm tra phần trăm giảm giá hợp lệ
    IF discount_percent_param <= 0 OR discount_percent_param > 100 THEN
        RAISE EXCEPTION 'Phần trăm giảm giá phải từ 1 đến 100';
    END IF;
    
    -- Kiểm tra ngày hết hạn hợp lệ
    IF expiration_date_param < CURRENT_DATE THEN
        RAISE EXCEPTION 'Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại';
    END IF;
    
    -- Tạo mã giảm giá mới
    INSERT INTO discount_codes (code, discount_percent, expiration_date)
    VALUES (code_param, discount_percent_param, expiration_date_param);
    
    COMMIT;
END;
$$;
