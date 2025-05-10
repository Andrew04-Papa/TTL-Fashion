import React from 'react';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  return (
    <div className="order-detail-container">
      <div className="order-detail-box">
        <h2>Chi tiết đơn hàng</h2>
        <div className="order-info">
          <p><strong>Mã đơn:</strong> #12345</p>
          <p><strong>Ngày đặt:</strong> 08/05/2025</p>
          <p><strong>Trạng thái:</strong> Đang giao</p>
        </div>

        <h3>Sản phẩm</h3>
        <table className="order-items">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Áo thun unisex basic</td>
              <td>2</td>
              <td>200.000đ</td>
              <td>400.000đ</td>
            </tr>
            {/* Thêm sản phẩm khác nếu cần */}
          </tbody>
        </table>

        <p className="total-amount"><strong>Tổng thanh toán:</strong> 850.000đ</p>
      </div>
    </div>
  );
};

export default OrderDetailPage;
