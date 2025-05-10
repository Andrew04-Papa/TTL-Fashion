import React from 'react';
import './UsersPage.css';

const UsersPage = () => {
  return (
    <div className="users-container">
      <div className="users-box">
        <h2>Quản lý người dùng</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#U001</td>
              <td>Nguyễn Văn A</td>
              <td>a@example.com</td>
              <td>Khách hàng</td>
              <td>
                <button>Sửa</button>
                <button>Xoá</button>
              </td>
            </tr>
            {/* Thêm người dùng khác nếu cần */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
