import { Link } from "react-router-dom"
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-column">
            <h3>TTL-Fashion</h3>
            <p>
              TTL-Fashion là thương hiệu thời trang hàng đầu Việt Nam, cung cấp các sản phẩm thời trang chất lượng cao
              với giá cả hợp lý.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Liên kết nhanh</h3>
            <ul className="footer-links">
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

          <div className="footer-column">
            <h3>Danh mục</h3>
            <ul className="footer-links">
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

          <div className="footer-column">
            <h3>Liên hệ</h3>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <FaMapMarkerAlt />
                <span>An Khánh, Ninh Kiều, TP. Cần Thơ</span>
              </div>
              <div className="footer-contact-item">
                <FaPhone />
                <a href="tel:+84963286124">+84 963 286 124</a>
              </div>
              <div className="footer-contact-item">
                <FaEnvelope />
                <a href="mailto:ttlfashion@gmail.com">ttlfashion@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TTL-Fashion. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
