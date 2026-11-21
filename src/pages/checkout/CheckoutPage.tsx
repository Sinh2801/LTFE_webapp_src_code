import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { clearCart, selectCartTotal } from '../../app/slices/cartSlice'
import { orderService } from '../../libs/services'
import type { PaymentMethod } from '../../libs/types'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export function CheckoutPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const cartItems = useAppSelector((state) => state.cart.items)
    const totalAmount = useAppSelector(selectCartTotal)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
    const [status, setStatus] = useState<'idle' | 'processing' | 'paid' | 'failed'>('idle')
    const [orderId, setOrderId] = useState('')
    const [error, setError] = useState('')

    const confirm = async () => {
        if (!cartItems.length || status === 'processing') return
        setStatus('processing'); setError('')
        try {
            const order = await orderService.create(cartItems.map((item) => item.id))
            setOrderId(order.id)
            await orderService.pay(order.id, paymentMethod)
            let result = order
            for (let attempt = 0; attempt < 8 && result.status === 'pending'; attempt += 1) {
                await wait(600)
                result = await orderService.get(order.id)
            }
            if (result.status === 'paid') {
                dispatch(clearCart())
                setStatus('paid')
            } else {
                setStatus('failed')
                setError('Giao dịch chưa thành công. Đơn hàng vẫn được lưu để bạn có thể thử lại.')
            }
        } catch (cause) {
            setStatus('failed')
            setError(cause instanceof Error ? cause.message : 'Không thể tạo đơn hàng. Vui lòng thử lại.')
        }
    }

    if (status === 'paid') return <main className="checkout-page checkout-result"><span className="checkout-result__icon">✓</span><span className="home-section__eyebrow">THANH TOÁN THÀNH CÔNG</span><h1>Cảm ơn bạn đã mua hàng</h1><p>Mã đơn hàng: <strong>{orderId}</strong>. Sản phẩm đã được ghi nhận trong tài khoản của bạn.</p><div><Link to="/profile">Xem đơn hàng</Link><Link to="/products">Tiếp tục khám phá</Link></div></main>

    return <main className="checkout-page">
        <div className="checkout-heading"><span className="home-section__eyebrow">HOÀN TẤT ĐƠN HÀNG</span><h1 className="checkout-title">Xác nhận thanh toán</h1><p>Kiểm tra sản phẩm và chọn phương thức thanh toán.</p></div>
        {cartItems.length === 0 ? <div className="catalog-empty"><h3>Giỏ hàng đang trống</h3><p>Thêm sản phẩm vào giỏ trước khi thanh toán.</p><Link to="/products">Khám phá mã nguồn</Link></div> : <div className="cart-layout">
            <div className="cart-left-column">
                <section className="checkout-section"><h2 className="section-title">Sản phẩm ({cartItems.length})</h2>{cartItems.map((item) => <div className="checkout-product-item" key={item.id}><span>{item.title}</span><strong className="checkout-product-price">{(item.salePrice ?? item.price).toLocaleString('vi-VN')} đ</strong></div>)}</section>
                <section className="checkout-section"><h2 className="section-title">Phương thức thanh toán</h2><div className="payment-methods">
                    <label className={`payment-method-label ${paymentMethod === 'card' ? 'active' : ''}`}><input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} /><div className="payment-info"><h4>Thẻ thanh toán</h4><p>Giao dịch mô phỏng được xử lý tự động.</p></div></label>
                    <label className={`payment-method-label ${paymentMethod === 'wallet' ? 'active' : ''}`}><input type="radio" name="payment" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} /><div className="payment-info"><h4>Ví điện tử</h4><p>Chọn để mô phỏng giao dịch không thành công.</p></div></label>
                </div></section>
            </div>
            <aside className="cart-summary"><div className="summary-row"><span>Tạm tính</span><span>{totalAmount.toLocaleString('vi-VN')} đ</span></div><div className="summary-row"><span>Phí thanh toán</span><span>Miễn phí</span></div><div className="summary-total"><span>Tổng tiền</span><strong>{totalAmount.toLocaleString('vi-VN')} đ</strong></div>{error && <p className="checkout-error" role="alert">{error}</p>}<button className="btn-checkout" disabled={status === 'processing'} onClick={confirm}>{status === 'processing' ? 'Đang xử lý thanh toán...' : status === 'failed' ? 'Thử thanh toán lại' : 'Xác nhận thanh toán'}</button><button className="btn-back-cart" onClick={() => navigate('/cart')}>← Quay lại giỏ hàng</button><p className="checkout-secure">Đơn hàng được lưu trong tài khoản để bạn theo dõi.</p></aside>
        </div>}
    </main>
}

export default CheckoutPage
