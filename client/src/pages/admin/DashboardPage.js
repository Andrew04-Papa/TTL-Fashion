import React from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2>Bảng điều khiển quản trị</h2>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Đơn hàng hôm nay</h3>
            <p>12</p>
          </div>
          <div className="dashboard-card">
            <h3>Doanh thu</h3>
            <p>18.500.000đ</p>
          </div>
          <div className="dashboard-card">
            <h3>Khách hàng mới</h3>
            <p>5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
