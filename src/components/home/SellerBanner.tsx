import { Link } from 'react-router-dom'

function SellerBanner() {
    return (
        <section className="home-seller-banner">
            <div>
                <span className="home-section__eyebrow">DÀNH CHO NGƯỜI BÁN</span>
                <h2>Chia sẻ sản phẩm của bạn với cộng đồng</h2>
                <p>Đăng bán mã nguồn, giới thiệu tính năng và tiếp cận người cần sản phẩm của bạn.</p>
            </div>
            <Link className="home-button home-button--light" to="/register">Bắt đầu bán <span aria-hidden="true">→</span></Link>
        </section>
    )
}

export default SellerBanner
