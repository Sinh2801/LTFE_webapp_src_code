import { Link } from 'react-router-dom'

function NotFoundPage() {
    return (
        <section className="not-found-page">
            <h1>404 - Không tìm thấy trang</h1>
            <p>Đường dẫn bạn truy cập không tồn tại.</p>
            <Link className="not-found-page__link" to="/">
                Về trang chủ
            </Link>
        </section>
    )
}

export default NotFoundPage
