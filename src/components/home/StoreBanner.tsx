import { Link } from 'react-router-dom'

function StoreBanner() {
    return (
        <section className="home-store-banner">
            <div className="home-store-banner__content">
                <span className="home-section__eyebrow">
                    BẮT ĐẦU VỚI <span className="eyebrow-accent">SOURCECODETST</span>
                </span>
                <h2>
                    Tìm mã nguồn phù hợp cho <span>dự án của bạn</span>
                </h2>
                <p>Duyệt danh mục, xem thông tin sản phẩm và hoàn tất đơn hàng trực tuyến.</p>
            </div>
            <Link className="home-store-banner__btn" to="/products">
                Khám phá sản phẩm <span aria-hidden="true">→</span>
            </Link>
        </section>
    )
}

export default StoreBanner
