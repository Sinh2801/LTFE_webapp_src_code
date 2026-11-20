import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import sourceCodeLogo from '../../assets/sourcecode-logo.png'

function Footer() {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    function handleSubscribe(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!email.trim()) return
        setSubscribed(true)
        setEmail('')
    }

    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-column footer-brand">
                    <Link to="/" className="footer-brand-link">
                        <img className="footer-brand-logo" src={sourceCodeLogo} alt="" />
                        <span>SourceCode<span className="brand-accent">TST</span></span>
                    </Link>
                    <p>Sàn thương mại trực tuyến cung cấp mã nguồn website, ứng dụng di động và đồ án chất lượng cao, đã được kiểm duyệt nghiêm ngặt.</p>
                    <div className="footer-contact-info">
                        <p><span>Email:</span> support@sourcecodetst.vn</p>
                        <p><span>Hotline:</span> 0901 234 567</p>
                        <p><span>Địa chỉ:</span> TP. Hồ Chí Minh, Việt Nam</p>
                        <p><span>Hỗ trợ:</span> 08:00 - 21:00 (T2 - CN)</p>
                    </div>
                </div>

                <div className="footer-column">
                    <h3>Danh mục mã nguồn</h3>
                    <Link to="/products">Tất cả mã nguồn</Link>
                    <Link to="/products?category=website">Mã nguồn Website</Link>
                    <Link to="/products?category=mobile-app">Ứng dụng di động</Link>
                    <Link to="/products?category=desktop-app">Ứng dụng máy tính</Link>
                    <Link to="/products?category=game">Mã nguồn Game</Link>
                    <Link to="/products?category=ai-ml">AI & Machine Learning</Link>
                    <Link to="/products?category=management">Quản trị & CRM</Link>
                </div>

                <div className="footer-column">
                    <h3>Dịch vụ & Tiện ích</h3>
                    <Link to="/products?sort=newest">Mã nguồn mới nhất</Link>
                    <Link to="/products?sort=rating">Đánh giá cao nhất</Link>
                    <Link to="/favorites">Mã nguồn yêu thích</Link>
                    <Link to="/cart">Giỏ hàng của bạn</Link>
                    <Link to="/profile">Lịch sử & Tải mã nguồn</Link>
                </div>

                <div className="footer-column">
                    <h3>Quy trình & Hỗ trợ</h3>
                    <a href="/#how-it-works">Mua trong 3 bước</a>
                    <a href="/#danh-gia">Đánh giá khách hàng</a>
                    <a href="/#tin-tuc">Góc công nghệ</a>
                    <span>Kiểm duyệt chất lượng 100%</span>
                    <span>Tải file tức thì sau thanh toán</span>
                    <span>Hỗ trợ kỹ thuật khi cài đặt</span>
                </div>

                <div className="footer-column">
                    <h3>Đăng ký nhận tin</h3>
                    <p>Nhận thông báo mã nguồn mới và mã giảm giá hàng tuần sớm nhất.</p>
                    <form className="newsletter" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Đăng ký</button>
                    </form>
                    {subscribed && <span className="newsletter-success">Cảm ơn bạn đã đăng ký nhận tin!</span>}
                    <div className="footer-payments">
                        <span>Phương thức thanh toán:</span>
                        <div className="footer-payment-tags">
                            <span className="payment-tag">Chuyển khoản QR</span>
                            <span className="payment-tag">VNPay</span>
                            <span className="payment-tag">MoMo</span>
                            <span className="payment-tag">Visa / Master</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <span>© 2026 SourceCodeTST. Toàn bộ bản quyền được bảo lưu.</span>
                    <div className="footer-bottom-links">
                        <span>Bảo mật thông tin</span>
                        <span>•</span>
                        <span>Điều khoản dịch vụ</span>
                        <span>•</span>
                        <span>Chính sách hoàn tiền</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
