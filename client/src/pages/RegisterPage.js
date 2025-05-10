import React from 'react';
import './RegisterPage.css'; // Tạo CSS cùng thư mục nếu bạn cần

const RegisterPage = () => {
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Đăng ký</h2>
        <form>
          <div className="input-group">
            <label htmlFor="name">Họ và tên</label>
            <input type="text" id="name" placeholder="Nhập họ tên" required />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Nhập email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input type="password" id="password" placeholder="Nhập mật khẩu" required />
          </div>
          <button type="submit">Đăng ký</button>
        </form>
        <p className="note">Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;
