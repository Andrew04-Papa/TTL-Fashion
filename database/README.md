# TTL-Fashion Database

Cơ sở dữ liệu PostgreSQL cho ứng dụng e-commerce TTL-Fashion.

## Cấu trúc thư mục

- `schema.sql`: Định nghĩa cấu trúc bảng và mối quan hệ
- `seed.sql`: Dữ liệu mẫu để khởi tạo cơ sở dữ liệu
- `functions.sql`: Các hàm SQL tùy chỉnh
- `views.sql`: Các view SQL
- `indexes.sql`: Các index để tối ưu hiệu suất truy vấn
- `procedures.sql`: Các stored procedure

## Cài đặt

1. Cài đặt PostgreSQL trên máy của bạn
2. Tạo cơ sở dữ liệu mới:
   \`\`\`
   createdb ttl_fashion
   \`\`\`
3. Chạy các script theo thứ tự:
   \`\`\`
   psql -d ttl_fashion -f schema.sql
   psql -d ttl_fashion -f seed.sql
   psql -d ttl_fashion -f functions.sql
   psql -d ttl_fashion -f views.sql
   psql -d ttl_fashion -f indexes.sql
   psql -d ttl_fashion -f procedures.sql
   \`\`\`

## Mô hình dữ liệu

### Bảng `users`
- Lưu trữ thông tin người dùng
- Bao gồm thông tin cá nhân và thông tin đăng nhập

### Bảng `categories`
- Lưu trữ các danh mục sản phẩm

### Bảng `products`
- Lưu trữ thông tin sản phẩm
- Liên kết với danh mục thông qua `category_id`

### Bảng `carts` và `cart_items`
- Lưu trữ giỏ hàng của người dùng
- Mỗi người dùng có một giỏ hàng
- `cart_items` lưu trữ các sản phẩm trong giỏ hàng

### Bảng `orders` và `order_items`
- Lưu trữ đơn hàng và chi tiết đơn hàng
- Mỗi đơn hàng có nhiều sản phẩm

### Bảng `discount_codes`
- Lưu trữ các mã giảm giá
- Bao gồm phần trăm giảm giá và ngày hết hạn

## Các chức năng SQL

### Functions
- `get_monthly_revenue`: Lấy doanh thu theo tháng
- `get_best_selling_products`: Lấy danh sách sản phẩm bán chạy nhất
- `get_order_details`: Lấy thông tin chi tiết đơn hàng

### Views
- `product_details`: Hiển thị thông tin sản phẩm đầy đủ
- `order_summary`: Hiển thị thông tin đơn hàng tổng hợp
- `user_safe_info`: Hiển thị thông tin người dùng an toàn (không có mật khẩu)
- `category_sales`: Hiển thị thống kê bán hàng theo danh mục

### Procedures
- `create_order`: Tạo đơn hàng mới
- `update_order_status`: Cập nhật trạng thái đơn hàng
- `create_discount_code`: Tạo mã giảm giá mới

### Triggers
- `restore_stock_on_cancel`: Khôi phục số lượng tồn kho khi đơn hàng bị hủy
