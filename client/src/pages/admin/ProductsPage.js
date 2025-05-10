import React from 'react';
import './ProductsPage.css';

const ProductsPage = () => {
  return (
    <div className="products-container">
      <div className="products-box">
        <h2>Quản lý sản phẩm</h2>
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#P001</td>
              <td>Áo hoodie TTL basic</td>
              <td>350.000đ</td>
              <td>25</td>
              <td>
                <button>Sửa</button>
                <button>Xoá</button>
              </td>
            </tr>
            {/* Thêm các dòng sản phẩm khác ở đây */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
