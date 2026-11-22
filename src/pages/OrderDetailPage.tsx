import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { removeFromCart } from '../app/slices/cartSlice'
import { fetchLibrary } from '../app/slices/librarySlice'
import { upsertOrder } from '../app/slices/orderSlice'
import InstallGuide from '../components/product/InstallGuide'
import { useDownload } from '../hooks/useDownload'
import { ApiError, getErrorMessage } from '../libs/apiClient'
import { formatDate, formatPrice } from '../libs/format'
import { orderService } from '../libs/services'
import type { Order } from '../libs/types'
import { WARRANTY_DAYS, warrantyFrom } from '../libs/warranty'

const POLL_MS = 1000
const POLL_MAX = 20

const STATUS_LABEL = { paid: 'Đã thanh toán', failed: 'Thanh toán thất bại', pending: 'Đang xử lý thanh toán' } as const
const METHOD_LABEL = { card: 'Thẻ thanh toán', wallet: 'Ví điện tử' } as const

function OrderDetailPage() {
    const { id = '' } = useParams()
    const dispatch = useAppDispatch()
    const location = useLocation()
    const { download, busyId } = useDownload()
    const library = useAppSelector((state) => state.library.items)
    const [order, setOrder] = useState<Order | null>(null)
    const [error, setError] = useState<{ status: number; message: string } | null>(null)
    const [polls, setPolls] = useState(0)
    const [guideFor, setGuideFor] = useState<string | null>(null)
    const handled = useRef<string | null>(null)
    const justPaid = (location.state as { justPaid?: boolean } | null)?.justPaid === true

    useEffect(() => { document.title = `Đơn hàng ${id} | SourceCodeTST` }, [id])

    useEffect(() => {
        let active = true
        orderService.get(id)
            .then((data) => {
                if (!active) return
                setOrder(data)
                setError(null)
                dispatch(upsertOrder(data))
            })
            .catch((cause: unknown) => {
                if (!active) return
                setError({ status: cause instanceof ApiError ? cause.status : 0, message: getErrorMessage(cause) })
            })
        return () => { active = false }
    }, [dispatch, id, polls])
    useEffect(() => {
        if (order?.status !== 'pending' || polls >= POLL_MAX) return
        const timer = window.setTimeout(() => setPolls((value) => value + 1), POLL_MS)
        return () => window.clearTimeout(timer)
    }, [order, polls])
    useEffect(() => {
        if (order?.status !== 'paid' || handled.current === order.id) return
        handled.current = order.id
        dispatch(fetchLibrary())
        order.items.forEach((item) => dispatch(removeFromCart(item.productId)))
    }, [dispatch, order])

    if (error) {
        return <main className="catalog-empty order-page-empty"><h1>{error.status === 404 ? 'Không tìm thấy đơn hàng' : 'Không mở được đơn hàng'}</h1><p>{error.message}</p><Link to="/profile?tab=don-hang">Về danh sách đơn hàng</Link></main>
    }
    if (!order) return <main className="order-page"><div className="loading"><span className="loading__spinner" />Đang tải đơn hàng...</div></main>

    const paid = order.status === 'paid'
    const stalled = order.status === 'pending' && polls >= POLL_MAX
    const purchasedAt = order.paidAt ?? order.createdAt
    const warranty = warrantyFrom(purchasedAt)

    return <main className="order-page">

        {paid && justPaid && <div className="order-banner order-banner--ok" role="status"><span aria-hidden="true">✓</span><div><strong>Thanh toán thành công</strong><p>Cảm ơn bạn đã mua hàng. Mã nguồn đã sẵn sàng để tải xuống ngay bên dưới.</p></div></div>}
        {order.status === 'pending' && <div className="order-banner order-banner--wait" role="status"><span className="loading__spinner" /><div><strong>{stalled ? 'Giao dịch vẫn chưa có kết quả' : 'Đang xử lý thanh toán...'}</strong><p>{stalled ? 'Hệ thống phản hồi chậm hơn bình thường.' : 'Vui lòng không đóng trang, kết quả sẽ tự cập nhật.'}</p>{stalled && <button type="button" className="btn-solid" onClick={() => setPolls(0)}>Kiểm tra lại</button>}</div></div>}
        {order.status === 'failed' && <div className="order-banner order-banner--bad" role="alert"><span aria-hidden="true">!</span><div><strong>Thanh toán chưa thành công</strong><p>Đơn hàng vẫn được lưu. Sản phẩm còn trong giỏ, bạn có thể đổi phương thức và thanh toán lại.</p><Link className="btn-solid" to="/checkout">Thử thanh toán lại</Link></div></div>}

        <section className="order-card invoice">
            <header className="invoice__head">
                <div>
                    <span className="home-section__eyebrow">{paid ? 'HÓA ĐƠN' : 'ĐƠN HÀNG'}</span>
                    <h1>Đơn hàng #{order.id}</h1>
                </div>
                <span className={`badge badge--${order.status === 'paid' ? 'ok' : order.status === 'failed' ? 'bad' : 'warn'}`}>{STATUS_LABEL[order.status]}</span>
            </header>
            <dl className="invoice__meta">
                <div><dt>Ngày đặt</dt><dd>{formatDate(order.createdAt, true)}</dd></div>
                <div><dt>Thanh toán</dt><dd>{order.paidAt ? formatDate(order.paidAt, true) : '—'}</dd></div>
                <div><dt>Phương thức</dt><dd>{order.paymentMethod ? METHOD_LABEL[order.paymentMethod] : '—'}</dd></div>
                {paid && <div><dt>Bảo hành đến</dt><dd>{formatDate(warranty.expiresAt)} {warranty.active ? `(còn ${warranty.daysLeft} ngày)` : '(đã hết hạn)'}</dd></div>}
            </dl>

            <ul className="invoice__items">
                {order.items.map((item) => {
                    const owned = library.find((entry) => entry.id === item.productId)
                    return <li key={item.productId}>
                        <div className="invoice__item-main">
                            {item.thumbnail && <img src={item.thumbnail} alt="" />}
                            <div>
                                <Link to={`/products/${item.productId}`}>{item.title}</Link>
                                {paid && owned && <small>Đã tải {owned.downloadCount} lần · phiên bản {owned.version}</small>}
                            </div>
                            <strong>{formatPrice(item.price)}</strong>
                        </div>
                        {paid && (
                            <div className="invoice__item-actions no-print">
                                <button type="button" className="btn-solid" disabled={busyId === item.productId} onClick={() => download(item.productId)}>{busyId === item.productId ? 'Đang tải...' : 'Tải mã nguồn'}</button>
                                <button type="button" className="btn-ghost" aria-expanded={guideFor === item.productId} onClick={() => setGuideFor(guideFor === item.productId ? null : item.productId)}>Hướng dẫn cài đặt</button>
                                <Link className="btn-ghost" to={`/products/${item.productId}?tab=danh-gia`}>Đánh giá</Link>
                            </div>
                        )}
                        {paid && guideFor === item.productId && owned && <div className="invoice__guide no-print"><InstallGuide product={owned} /></div>}
                    </li>
                })}
            </ul>
            <div className="invoice__total"><span>Tổng thanh toán</span><strong>{formatPrice(order.total)}</strong></div>
        </section>

        {paid && <section className="order-card order-next no-print">
            <h2>Bước tiếp theo</h2>
            <ul className="benefit-list">
                <li>Mua một lần, bạn có thể tải lại mã nguồn bất cứ lúc nào trong Hồ sơ → Mã nguồn đã mua</li>
                <li>Bảo hành {WARRANTY_DAYS} ngày: gặp lỗi hoặc cần hỗ trợ cài đặt, gửi yêu cầu tại Hồ sơ → Bảo hành</li>
                <li>Sau khi dùng thử, hãy để lại đánh giá để giúp người mua sau</li>
            </ul>
        </section>}

        <div className="order-actions no-print">
            <Link className="btn-ghost" to="/profile?tab=don-hang">← Danh sách đơn hàng</Link>
            {paid && <Link className="btn-ghost" to="/profile?tab=da-mua">Mã nguồn đã mua</Link>}
            {paid && <button type="button" className="btn-solid" onClick={() => window.print()}>In hóa đơn</button>}
            <Link className="btn-ghost" to="/products">Tiếp tục khám phá</Link>
        </div>
    </main>
}

export default OrderDetailPage
