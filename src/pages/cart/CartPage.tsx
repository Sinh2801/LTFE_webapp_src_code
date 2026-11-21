import {useSelector, useDispatch} from 'react-redux';
import {selectCartTotal, clearCart, removeManyFromCart} from '../../app/slices/cartSlice.ts';
import {Link, useNavigate} from 'react-router-dom';
import {CartItem} from './CartItem.tsx';
import {useEffect} from "react";
import {useAppSelector} from '../../app/hook';
import type {Product} from '../../libs/types.ts';
import {WARRANTY_DAYS} from '../../libs/warranty';

function CartPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state: any) => state.cart.items) as Product[];
    const totalAmount = useSelector(selectCartTotal);
    const user = useAppSelector((state) => state.auth.user);
    const libraryItems = useAppSelector((state) => state.library.items);
    const libraryIds = libraryItems.map((item) => item.id);
    const ownedInCart = cartItems.filter((item) => libraryIds.includes(item.id));
    const payableTotal = cartItems
        .filter((item) => !libraryIds.includes(item.id))
        .reduce((sum, item) => sum + (item.salePrice ?? item.price), 0);

    useEffect(() => {
        document.title = 'Giỏ hàng | SourceCodeTST'
    }, [])

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
                    {cartItems.length > 0 && (
                        <button className="btn-clear-all" onClick={clearAll}>
                            Xóa tất cả
                        </button>
                    )}
                </div>
                {cartItems.length === 0 ? (
                    <div className="empty-state">
                        <p>Giỏ hàng đang trống. Hãy tìm thêm mã nguồn nhé!</p>
                        <Link to="/products" className="btn btn-primary">Khám phá mã nguồn</Link>
                    </div>) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {ownedInCart.length > 0 && (
                                <div className="cart-alert" role="alert">
                                    <p><strong>{ownedInCart.length} mã nguồn trong giỏ bạn đã sở hữu.</strong> Mỗi tài khoản chỉ mua một lần, hãy xóa chúng để tiếp tục thanh toán.</p>
                                    <button type="button" onClick={() => dispatch(removeManyFromCart(ownedInCart.map((item) => item.id)))}>Xóa các mã đã sở hữu</button>
                                </div>
                            )}
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
                            {ownedInCart.length > 0 && (
                                <div className="summary-row">
                                    <span>Cần thanh toán:</span>
                                    <span>{payableTotal.toLocaleString('vi-VN')} đ</span>
                                </div>
                            )}

                            <div className="summary-total">
                                <span>Tổng tiền:</span>
                                <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                            </div>

                            <button className="btn-checkout" disabled={ownedInCart.length > 0} onClick={() => navigate('/checkout')}>
                                {user ? 'Tiến hành thanh toán' : 'Đăng nhập để thanh toán'}
                            </button>
                            {!user && <p className="cart-guest-note">Bạn có thể giữ giỏ hàng khi chưa đăng nhập. Hệ thống sẽ yêu cầu đăng nhập ở bước thanh toán.</p>}
                            <ul className="cart-perks">
                                <li>Mua một lần, tải lại không giới hạn</li>
                                <li>Bảo hành {WARRANTY_DAYS} ngày kèm hướng dẫn cài đặt</li>
                            </ul>
                        </div>
                    </div>)}
            </div>
        </>
    )
}

export default CartPage;
