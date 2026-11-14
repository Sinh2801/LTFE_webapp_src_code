import { Link } from 'react-router-dom'

function Hero() {
    return (
        <>
            <section className="home-hero">
                <div className="home-hero__content">
                    <span className="home-hero__eyebrow">MARKET CODE SOURCE</span>
                    <h1>Tìm mã nguồn phù hợp, bắt đầu dự án nhanh hơn</h1>
                    <p>Khám phá website và ứng dụng được chia sẻ bởi cộng đồng lập trình viên.</p>
                    <div className="home-hero__actions">
                        <Link className="home-button home-button--primary" to="/products">
                            Khám phá sản phẩm <span aria-hidden="true">→</span>
                        </Link>
                        <Link className="home-button home-button--secondary" to="/register">
                            Đăng bán mã nguồn <span aria-hidden="true">＋</span>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="home-benefits" aria-label="Lợi ích khi mua mã nguồn">
                <div><span className="home-benefits__icon">⌘</span><span><strong>Nhiều lựa chọn</strong><small>Tìm theo danh mục và công nghệ</small></span></div>
                <div><span className="home-benefits__icon">▣</span><span><strong>Thông tin rõ ràng</strong><small>Xem mô tả trước khi mua</small></span></div>
                <div><span className="home-benefits__icon">◇</span><span><strong>Thanh toán tiện lợi</strong><small>Quản lý đơn hàng dễ dàng</small></span></div>
                <div><span className="home-benefits__icon">↓</span><span><strong>Tải sau khi mua</strong><small>Truy cập mã nguồn trong thư viện</small></span></div>
            </section>
        </>
    )
}

export default Hero
