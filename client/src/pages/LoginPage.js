import React from 'react';
import './LoginPage.css'; 

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <form>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Nhập email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input type="password" id="password" placeholder="Nhập mật khẩu" required />
          </div>
          <button type="submit">Đăng nhập</button>
        </form>
        <p className="note">Chưa có tài khoản? <a href="/register">Đăng ký</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
