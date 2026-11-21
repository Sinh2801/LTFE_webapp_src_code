import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { removeFromCart, selectCartTotal } from '../../app/slices/cartSlice'
import { upsertOrder } from '../../app/slices/orderSlice'
import { getErrorMessage } from '../../libs/apiClient'
import { orderService } from '../../libs/services'
import type { Order, PaymentMethod } from '../../libs/types'
import { WARRANTY_DAYS } from '../../libs/warranty'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export function CheckoutPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const cartItems = useAppSelector((state) => state.cart.items)
    const libraryItems = useAppSelector((state) => state.library.items)
    const libraryIds = libraryItems.map((item) => item.id)
    const totalAmount = useAppSelector(selectCartTotal)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
    const [status, setStatus] = useState<'idle' | 'processing' | 'failed'>('idle')
    const [pendingOrder, setPendingOrder] = useState<Order | null>(null)
    const [error, setError] = useState('')

    const ownedItems = cartItems.filter((item) => libraryIds.includes(item.id))
    const blocked = ownedItems.length > 0

    const confirm = async () => {
        if (!cartItems.length || status === 'processing' || blocked) return
        setStatus('processing'); setError('')
        try {
            let order = pendingOrder
            if (!order) {
                order = await orderService.create(cartItems.map((item) => item.id))
                setPendingOrder(order)
                dispatch(upsertOrder(order))
            }
            await orderService.pay(order.id, paymentMethod)
            let result = order
            for (let attempt = 0; attempt < 10 && result.status !== 'paid' && result.status !== 'failed'; attempt += 1) {
                await wait(600)
                result = await orderService.get(order.id)
            }
            dispatch(upsertOrder(result))
            if (result.status === 'paid') {
                result.items.forEach((item) => dispatch(removeFromCart(item.productId)))
                navigate(`/orders/${result.id}`, { replace: true, state: { justPaid: true } })
                return
            }
            setStatus('failed')
            setError(result.status === 'failed'
                ? 'Giao dịch chưa thành công. Đơn hàng vẫn được lưu, bạn có thể đổi phương thức và thử lại.'
                : 'Hệ thống vẫn đang xử lý giao dịch. Vui lòng kiểm tra lại trong mục Đơn hàng.')
        } catch (cause) {
            setStatus('failed')
            setError(getErrorMessage(cause))
        }
    }

    return <main className="checkout-page">
        <div className="checkout-heading"><span className="home-section__eyebrow">HOÀN TẤT ĐƠN HÀNG</span><h1 className="checkout-title">Xác nhận thanh toán</h1><p>Kiểm tra sản phẩm và chọn phương thức thanh toán.</p></div>
        {cartItems.length === 0 ? <div className="catalog-empty"><h3>Giỏ hàng đang trống</h3><p>Thêm sản phẩm vào giỏ trước khi thanh toán.</p><Link to="/products">Khám phá mã nguồn</Link></div> : <div className="cart-layout">
            <div className="cart-left-column">
                {blocked && <div className="cart-alert" role="alert"><p><strong>Giỏ hàng có {ownedItems.length} mã nguồn bạn đã sở hữu.</strong> Mỗi tài khoản chỉ mua một lần. Hãy quay lại giỏ hàng để xóa các mã đó.</p><button type="button" onClick={() => navigate('/cart')}>Về giỏ hàng</button></div>}
                <section className="checkout-section"><h2 className="section-title">Sản phẩm ({cartItems.length})</h2>{cartItems.map((item) => <div className={libraryIds.includes(item.id) ? 'checkout-product-item is-owned' : 'checkout-product-item'} key={item.id}><span>{item.title}{libraryIds.includes(item.id) && <em className="checkout-owned-tag">Đã sở hữu</em>}</span><strong className="checkout-product-price">{(item.salePrice ?? item.price).toLocaleString('vi-VN')} đ</strong></div>)}</section>
                <section className="checkout-section"><h2 className="section-title">Phương thức thanh toán</h2><div className="payment-methods">
                    <label className={`payment-method-label ${paymentMethod === 'card' ? 'active' : ''}`}><input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} /><div className="payment-info"><h4>Thẻ thanh toán</h4><p>Giao dịch mô phỏng được xử lý tự động.</p></div></label>
                    <label className={`payment-method-label ${paymentMethod === 'wallet' ? 'active' : ''}`}><input type="radio" name="payment" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} /><div className="payment-info"><h4>Ví điện tử</h4><p>Chọn để mô phỏng giao dịch không thành công.</p></div></label>
                </div></section>
                <section className="checkout-section checkout-policy"><h2 className="section-title">Quyền lợi sau khi mua</h2><ul className="benefit-list"><li>Tải mã nguồn ngay sau khi thanh toán thành công, tải lại không giới hạn</li><li>Bảo hành {WARRANTY_DAYS} ngày kể từ ngày thanh toán</li><li>Hướng dẫn cài đặt chi tiết và hỗ trợ kỹ thuật</li></ul><p><Link to="/chinh-sach#bao-hanh">Xem chính sách bảo hành</Link> · <Link to="/chinh-sach#hoan-tien">Chính sách hoàn tiền</Link></p></section>
            </div>
            <aside className="cart-summary"><div className="summary-row"><span>Tạm tính</span><span>{totalAmount.toLocaleString('vi-VN')} đ</span></div><div className="summary-row"><span>Phí thanh toán</span><span>Miễn phí</span></div><div className="summary-total"><span>Tổng tiền</span><strong>{totalAmount.toLocaleString('vi-VN')} đ</strong></div>{error && <p className="checkout-error" role="alert">{error}</p>}<button className="btn-checkout" disabled={status === 'processing' || blocked} onClick={confirm}>{status === 'processing' ? 'Đang xử lý thanh toán...' : status === 'failed' ? 'Thử thanh toán lại' : 'Xác nhận thanh toán'}</button><button className="btn-back-cart" onClick={() => navigate('/cart')}>← Quay lại giỏ hàng</button><p className="checkout-secure">Đơn hàng được lưu trong tài khoản để bạn theo dõi.</p></aside>
        </div>}
    </main>
}

export default CheckoutPage
