import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartTotal } from '../../app/slices/cartSlice.ts';
import { useState } from 'react';

export function CheckoutPage() {
    const navigate = useNavigate();

    // Đọc dữ liệu từ Redux
    const cartItems = useSelector((state: any) => state.cart.items);
    const totalAmount = useSelector(selectCartTotal);

    // Local State để lưu phương thức đang được chọn
    // Mặc định chọn 'credit_card'
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const handleConfirmPayment = () => {
        if (paymentMethod === 'credit_card') {
            alert('Thanh toán thành công!');
            // gọi API, xóa giỏ hàng, rồi navigate sang trang Success
        } else {
            alert('Giao dịch thất bại! (Mô phỏng ví điện tử)');
            // Navigate sang trang Failed
        }
    };

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Xác nhận đơn hàng</h1>

            <div className="cart-layout">
                <div className="cart-left-column">
                    <div className="checkout-section">
                        <h3 className="section-title">Sản phẩm</h3>
                        {cartItems.map((item: any) => (
                            <div className="checkout-product-item" key={item.id}>
                                <span>{item.title}</span>
                                <span className="checkout-product-price">
                                    {(item.salePrice ?? item.price).toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-section">
                        <h3 className="section-title">Phương thức thanh toán</h3>
                        <div className="payment-methods">

                            {/* Option 1: Thẻ tín dụng */}
                            <label className={`payment-method-label ${paymentMethod === 'credit_card' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="credit_card"
                                    checked={paymentMethod === 'credit_card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-info">
                                    <h4>Thẻ tín dụng (giả lập)</h4>
                                    <p>Giao dịch sẽ thành công sau vài giây</p>
                                </div>
                            </label>
                            <label className={`payment-method-label ${paymentMethod === 'ewallet' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="ewallet"
                                    checked={paymentMethod === 'ewallet'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="payment-info">
                                    <h4>Ví điện tử (giả lập)</h4>
                                    <p>Giao dịch mô phỏng thất bại, để kiểm thử trạng thái failed</p>
                                </div>
                            </label>

                        </div>
                    </div>

                </div>
                <div className="cart-summary">
                    <div className="summary-total" style={{ borderTop: 'none', margin: '0 0 20px', paddingTop: 0 }}>
                        <span>Tổng tiền:</span>
                        <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                    </div>

                    <button className="btn-checkout" onClick={handleConfirmPayment}>
                        Xác nhận thanh toán
                    </button>

                    <div className="btn-back-cart" onClick={() => navigate('/cart')}>
                        ← Quay lại giỏ hàng
                    </div>
                </div>

            </div>
        </div>
    );
}
export default CheckoutPage