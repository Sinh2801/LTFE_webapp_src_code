import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { fetchOrders } from '../../app/slices/orderSlice'
import { formatDate, formatPrice } from '../../libs/format'

const STATUS = {
    paid: { label: 'Đã thanh toán', tone: 'ok' },
    failed: { label: 'Thanh toán thất bại', tone: 'bad' },
    pending: { label: 'Đang xử lý', tone: 'warn' },
} as const

function OrdersTab() {
    const dispatch = useAppDispatch()
    const { orders, status, error } = useAppSelector((state) => state.orders)

    if (status === 'loading' && orders.length === 0) return <div className="loading" role="status"><span className="loading__spinner" />Đang tải đơn hàng...</div>
    if (status === 'failed' && orders.length === 0) {
        return <div className="catalog-empty"><h3>Chưa tải được đơn hàng</h3><p>{error}</p><button type="button" onClick={() => dispatch(fetchOrders())}>Thử lại</button></div>
    }
    if (orders.length === 0) {
        return <div className="catalog-empty"><h3>Bạn chưa có đơn hàng</h3><p>Các đơn hàng của bạn sẽ hiển thị tại đây sau khi đặt mua.</p><Link to="/products">Khám phá mã nguồn</Link></div>
    }

    return (
        <div className="acct-list">
            {orders.map((order) => (
                <article className="acct-card acct-order" key={order.id}>
                    <header>
                        <div>
                            <strong>Đơn hàng #{order.id}</strong>
                            <time dateTime={order.createdAt}>{formatDate(order.createdAt, true)}</time>
                        </div>
                        <span className={`badge badge--${STATUS[order.status].tone}`}>{STATUS[order.status].label}</span>
                    </header>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item.productId}><Link to={`/products/${item.productId}`}>{item.title}</Link><span>{formatPrice(item.price)}</span></li>
                        ))}
                    </ul>
                    <footer>
                        <span>Tổng đơn hàng <strong>{formatPrice(order.total)}</strong></span>
                        <div>
                            <Link className="btn-ghost" to={`/orders/${order.id}`}>{order.status === 'paid' ? 'Chi tiết & hóa đơn' : 'Xem chi tiết'}</Link>
                            {order.status === 'failed' && <Link className="btn-solid" to="/checkout">Thanh toán lại</Link>}
                        </div>
                    </footer>
                </article>
            ))}
        </div>
    )
}

export default OrdersTab
