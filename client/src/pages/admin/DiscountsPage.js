import React from 'react';
import './DiscountsPage.css';

const DiscountsPage = () => {
  return (
    <div className="discounts-container">
      <div className="discounts-box">
        <h2>Quản lý mã giảm giá</h2>
        <table className="discounts-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Giảm</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SALE50</td>
              <td>50%</td>
              <td>01/05/2025</td>
              <td>10/05/2025</td>
              <td>
                <button>Sửa</button>
                <button>Xoá</button>
              </td>
            </tr>
            {/* Thêm mã khác nếu cần */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountsPage;
