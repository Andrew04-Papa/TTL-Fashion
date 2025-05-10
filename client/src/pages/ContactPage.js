import React from 'react';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-box">
        <h2>Liên hệ với chúng tôi</h2>
        <p>Gửi thắc mắc, góp ý hoặc yêu cầu hỗ trợ qua biểu mẫu bên dưới.</p>
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
            <label htmlFor="message">Nội dung</label>
            <textarea id="message" placeholder="Nhập tin nhắn của bạn..." required></textarea>
          </div>
          <button type="submit">Gửi liên hệ</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
