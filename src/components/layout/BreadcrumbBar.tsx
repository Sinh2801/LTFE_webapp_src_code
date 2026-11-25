import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hook'

interface BreadcrumbItem {
    label: string
    path?: string
}

function BreadcrumbBar() {
    const { pathname } = useLocation()
    const productDetail = useAppSelector((state) => state.products.detail)

    if (pathname === '/') return null

    let items: BreadcrumbItem[] = []

    if (pathname === '/products') {
        items = [{ label: 'Sản phẩm' }]
    } else if (pathname.startsWith('/products/')) {
        items = [
            { label: 'Sản phẩm', path: '/products' },
            { label: productDetail?.title || 'Chi tiết sản phẩm' }
        ]
    } else if (pathname === '/cart') {
        items = [{ label: 'Giỏ hàng' }]
    } else if (pathname === '/checkout') {
        items = [
            { label: 'Giỏ hàng', path: '/cart' },
            { label: 'Thanh toán' }
        ]
    } else if (pathname === '/favorites') {
        items = [{ label: 'Mã nguồn yêu thích' }]
    } else if (pathname === '/profile') {
        items = [{ label: 'Tài khoản' }]
    } else if (pathname.startsWith('/orders/')) {
        items = [
            { label: 'Tài khoản', path: '/profile' },
            { label: 'Chi tiết đơn hàng' }
        ]
    } else if (pathname === '/chinh-sach') {
        items = [{ label: 'Chính sách' }]
    } else {
        items = [{ label: 'Trang' }]
    }

    return (
        <nav className="breadcrumb-bar" aria-label="Đường dẫn">
            <div className="breadcrumb-container">
                <Link to="/" className="breadcrumb-home">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Trang chủ</span>
                </Link>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <span key={index} className="breadcrumb-step">
                            <span className="breadcrumb-separator">/</span>
                            {isLast || !item.path ? (
                                <span className="breadcrumb-current">{item.label}</span>
                            ) : (
                                <Link to={item.path} className="breadcrumb-link">{item.label}</Link>
                            )}
                        </span>
                    )
                })}
            </div>
        </nav>
    )
}

export default BreadcrumbBar
