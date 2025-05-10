import React from 'react';
import './OrdersPage.css';

const OrdersPage = () => {
  return (
    <div className="orders-container">
      <div className="orders-box">
        <h2>Lịch sử đơn hàng</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#12345</td>
              <td>08/05/2025</td>
              <td>Đang xử lý</td>
              <td>850.000đ</td>
            </tr>
            {/* Thêm các đơn khác ở đây */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
