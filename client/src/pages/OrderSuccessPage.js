import React from 'react';
import './OrderSuccessPage.css'; 

const OrderSuccessPage = () => {
  return (
    <div className="success-container">
      <div className="success-box">
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua sắm tại TTL-Fashion.</p>
        <p>Chúng tôi sẽ gửi email xác nhận đơn hàng đến bạn sớm.</p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
