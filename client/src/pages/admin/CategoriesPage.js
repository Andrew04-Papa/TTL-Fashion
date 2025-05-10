import React from 'react';
import './CategoriesPage.css';

const CategoriesPage = () => {
  return (
    <div className="categories-container">
      <div className="categories-box">
        <h2>Quản lý danh mục</h2>
        <table className="categories-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#C01</td>
              <td>Áo thun</td>
              <td>
                <button>Sửa</button>
                <button>Xoá</button>
              </td>
            </tr>
            {/* Thêm danh mục khác nếu cần */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
