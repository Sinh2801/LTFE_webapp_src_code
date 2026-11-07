import { useSelector, useDispatch} from 'react-redux';
import {removeFromCart, selectCartTotal, clearCart} from '../app/slices/cartSlice';

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

    const handleRemove = (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa source code này khỏi giỏ hàng?')) {
            dispatch(removeFromCart(id));
        }
    };

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
                                <div className="cart-item" key={item.id}>
                                    <img src={item.image} alt={item.name} className="item-img" />

                                    <div className="item-info">
                                        <h3 className="item-name">{item.name}</h3>
                                        <div className="item-price">
                                            {(item.salePrice || item.price).toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>

                                    <div className="item-actions">
                                        <button className="btn-remove" onClick={() => handleRemove(item.id)}>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
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