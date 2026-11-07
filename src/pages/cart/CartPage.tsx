import {useSelector, useDispatch} from 'react-redux';
import {selectCartTotal, clearCart} from '../../app/slices/cartSlice.ts';
import {CartItem} from './CartItem.tsx';

function CartPage() {

    // Lấy dữ liệu giỏ hàng từ Redux Store
    const dispatch = useDispatch();
    const cartItems = useSelector((state: any) => state.cart.items);
    const totalAmount = useSelector(selectCartTotal);

    const clearAll = () => {
        if(window.confirm('Bạn có chắc muốn làm sạch toàn bộ giỏ hàng?')) {
            dispatch(clearCart())
        }
    }

    return (
        <>
            <div className="cart-page">
                <div className="cart-header">
                    <h1 className="cart-title">Giỏ hàng của bạn</h1>
                        <button className="btn-clear-all" onClick={clearAll}>
                            Xóa tất cả
                        </button>
                </div>
                    <div className="cart-layout">
                        {/* Cột trái: Danh sách Source Code */}
                        <div className="cart-items">
                            {cartItems.map((item: any) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Số lượng code:</span>
                                <span>{cartItems.length} mục</span>
                            </div>
                            <div className="summary-row">
                                <span>Tạm tính:</span>
                                <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                            </div>

                            <div className="summary-total">
                                <span>Tổng tiền:</span>
                                <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                            </div>

                            <button className="btn-checkout">
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default CartPage;