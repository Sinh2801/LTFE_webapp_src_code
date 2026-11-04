import { Link } from 'react-router-dom';

    function Footer() {
        return (
            <footer className="site-footer">
                <div className="footer-container">
                    <div className="footer-column footer-brand">
                        <h2>SourceCodeTST</h2>
                        <p>Nền tảng mua bán và ký gửi mã nguồn chất lượng cao, hàng đầu Việt Nam.</p>
                        <p>Email: support@sourcecodetst.vn</p>
                        <p>Hotline: 1900 xxxx</p>
                        <p>Địa chỉ: TP. Hồ Chí Minh</p>
                    </div>

                    <div className="footer-column">
                        <h3>Về SourceCodeTST</h3>
                        <Link to="/">Giới thiệu</Link>
                        <span>Tin tức & Sự kiện</span>
                        <span>Tuyển dụng</span>
                        <span>Liên hệ</span>
                        <span>Chương trình cộng tác viên</span>
                    </div>

                    <div className="footer-column">
                        <h3>Khám phá</h3>
                        <Link to="/products">Mua mã nguồn</Link>
                        <span>Ký gửi/Bán mã nguồn</span>
                        <span>Yêu cầu thiết kế</span>
                        <span>Mã nguồn miễn phí</span>
                        <span>Tài liệu API</span>
                    </div>

                    <div className="footer-column">
                        <h3>Hỗ trợ khách hàng</h3>
                        <span>Trung tâm trợ giúp</span>
                        <span>Quy trình mua hàng</span>
                        <span>Chính sách bảo mật</span>
                        <span>Điều khoản sử dụng</span>
                        <span>Chính sách hoàn tiền</span>
                    </div>

                    <div className="footer-column">
                        <h3>Đăng ký nhận tin</h3>
                        <p>Nhận thông tin cập nhật và khuyến mãi mới nhất.</p>
                        <div className="newsletter">
                            <input type="email" placeholder="Nhập email của bạn..." />
                            <button type="button">Đăng ký</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2026 SourceCodeTST. All rights reserved.
                </div>
            </footer>
        );
    }

    export default Footer;
