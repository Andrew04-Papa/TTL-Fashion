import React from 'react';
import './CheckoutPage.css'; // Nếu cần styling, bạn có thể tạo file CSS cùng tên

const CheckoutPage = () => {
  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2>Thanh toán</h2>
        <p>Thông tin đơn hàng của bạn sẽ hiển thị tại đây.</p>
        {/* Bạn có thể thêm form địa chỉ, phương thức thanh toán, xác nhận đơn hàng, v.v. */}
      </div>
    </div>
  );
};

export default CheckoutPage;
