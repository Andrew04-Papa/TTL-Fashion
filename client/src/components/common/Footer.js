import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>TTL-Fashion</h3>
            <p>
              TTL-Fashion là thương hiệu thời trang hàng đầu Việt Nam, cung cấp các sản phẩm thời trang chất lượng cao
              với giá cả hợp lý.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="footer-section links">
            <h3>Liên kết nhanh</h3>
            <ul>
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/products">Sản phẩm</Link>
              </li>
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
              <li>
                <Link to="/login">Đăng nhập</Link>
              </li>
              <li>
                <Link to="/register">Đăng ký</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section categories">
            <h3>Danh mục</h3>
            <ul>
              <li>
                <Link to="/products?category=1">Thời trang nam</Link>
              </li>
              <li>
                <Link to="/products?category=2">Thời trang nữ</Link>
              </li>
              <li>
                <Link to="/products?category=3">Phụ kiện</Link>
              </li>
              <li>
                <Link to="/products?category=4">Giày dép</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Liên hệ</h3>
            <div className="contact-info">
              <p>
                <FaMapMarkerAlt />
                <span>An Khánh, Ninh Kiều, TP. Cần Thơ </span>
              </p>
              <p>
                <FaPhone />
                <span>+84 963 286 124</span>
              </p>
              <p>
                <FaEnvelope />
                <span>ttlfashion@gmail.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TTL-Fashion. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
