import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Hồ sơ cá nhân</h2>
        <div className="profile-info">
          <p><strong>Họ tên:</strong> Nguyễn Văn A</p>
          <p><strong>Email:</strong> nguyenvana@email.com</p>
          <p><strong>Số điện thoại:</strong> 0123 456 789</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
