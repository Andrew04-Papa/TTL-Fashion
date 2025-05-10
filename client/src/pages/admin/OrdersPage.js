import React from 'react';
import './OrdersPage.css';

const OrdersPage = () => {
  return (
    <div className="admin-orders-container">
      <div className="admin-orders-box">
        <h2>Quản lý đơn hàng</h2>
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Tổng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#12345</td>
              <td>Nguyễn Văn A</td>
              <td>08/05/2025</td>
              <td>Đang giao</td>
              <td>950.000đ</td>
              <td>
                <button>Xem</button>
                <button>Xoá</button>
              </td>
            </tr>
            {/* Thêm đơn hàng khác nếu cần */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
