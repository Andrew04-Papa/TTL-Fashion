# TTL-Fashion E-commerce Backend

Backend API cho website thời trang TTL-Fashion sử dụng Node.js, Express và PostgreSQL.

## Cài đặt

1. Clone repository:
\`\`\`bash
git clone https://github.com/Andrew04-Papa/TTL-Fashion.git
cd TTL-Fashion
\`\`\`

2. Cài đặt các dependencies:
\`\`\`bash
npm install
\`\`\`

3. Tạo file .env và cấu hình các biến môi trường:
\`\`\`
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ttl_fashion
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
\`\`\`

4. Tạo cơ sở dữ liệu PostgreSQL:
\`\`\`sql
CREATE DATABASE ttl_fashion;
\`\`\`

5. Chạy các script SQL để tạo bảng và dữ liệu mẫu (xem phần Database Schema).

6. Khởi động server:
\`\`\`bash
npm run dev
\`\`\`

## Database Schema

\`\`\`sql
-- Bảng người dùng
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng danh mục sản phẩm
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Bảng sản phẩm
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng giỏ hàng
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng chi tiết giỏ hàng
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER DEFAULT 1
);

-- Bảng đơn hàng
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_address TEXT
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Bảng mã giảm giá
CREATE TABLE discount_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER CHECK (discount_percent BETWEEN 0 AND 100),
    expiration_date DATE
);
\`\`\`

## API Endpoints

### Người dùng
- `POST /api/users/register` - Đăng ký người dùng mới
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/me` - Lấy thông tin người dùng hiện tại
- `PUT /api/users/me` - Cập nhật thông tin người dùng
- `PUT /api/users/change-password` - Đổi mật khẩu

### Sản phẩm
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy thông tin chi tiết sản phẩm
- `GET /api/products/search` - Tìm kiếm sản phẩm
- `POST /api/products` - Thêm sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Danh mục
- `GET /api/products/categories` - Lấy danh sách danh mục
- `GET /api/products/categories/:id` - Lấy thông tin chi tiết danh mục
- `POST /api/products/categories` - Thêm danh mục mới (Admin)
- `PUT /api/products/categories/:id` - Cập nhật danh mục (Admin)
- `DELETE /api/products/categories/:id` - Xóa danh mục (Admin)

### Giỏ hàng
- `GET /api/cart` - Lấy giỏ hàng của người dùng
- `POST /api/cart/items` - Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/items/:id` - Cập nhật số lượng sản phẩm trong giỏ hàng
- `DELETE /api/cart/items/:id` - Xóa sản phẩm khỏi giỏ hàng
- `DELETE /api/cart` - Xóa tất cả sản phẩm trong giỏ hàng

### Đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders/my-orders` - Lấy danh sách đơn hàng của người dùng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `GET /api/orders` - Lấy tất cả đơn hàng (Admin)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)
- `GET /api/orders/stats/summary` - Lấy thống kê đơn hàng (Admin)

### Mã giảm giá
- `POST /api/discounts/validate` - Kiểm tra mã giảm giá
- `GET /api/discounts` - Lấy tất cả mã giảm giá (Admin)
- `POST /api/discounts` - Tạo mã giảm giá mới (Admin)
- `PUT /api/discounts/:id` - Cập nhật mã giảm giá (Admin)
- `DELETE /api/discounts/:id` - Xóa mã giảm giá (Admin)

## Công nghệ sử dụng

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- dotenv
- cors
- morgan
