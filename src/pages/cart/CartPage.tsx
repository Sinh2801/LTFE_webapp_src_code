import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {clearCart, removeManyFromCart, setSelectedIds, toggleSelectItem,} from '../../app/slices/cartSlice';
import { CartItem } from './CartItem';
import { WARRANTY_DAYS } from '../../libs/warranty';

function CartPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const cartItems = useAppSelector((state) => state.cart.items);
    const selectedIds = useAppSelector((state) => state.cart.selectedIdx);
    const user = useAppSelector((state) => state.auth.user);
    const libraryItems = useAppSelector((state) => state.library.items);

    const libraryIds = libraryItems.map((item) => item.id);
    const ownedInCart = cartItems.filter((item) =>
        libraryIds.includes(item.id),
    );
    const selectableItems = cartItems.filter(
        (item) => !libraryIds.includes(item.id),
    );
    const selectedItems = selectableItems.filter((item) =>
        selectedIds.includes(item.id),
    );

    const allSelectableChecked =
        selectableItems.length > 0 &&
        selectableItems.every((item) => selectedIds.includes(item.id));

    const selectedTotal = selectedItems.reduce(
        (sum, item) => sum + (item.salePrice ?? item.price),
        0,
    );

    useEffect(() => {
        document.title = 'Giỏ hàng | SourceCodeTST';
    }, []);

    const clearAll = () => {
        if (window.confirm('Bạn có chắc muốn làm sạch toàn bộ giỏ hàng?')) {
            dispatch(clearCart());
        }
    };

    const handleToggleAll = () => {
        if (allSelectableChecked) {
            dispatch(setSelectedIds([]));
        } else {
            dispatch(setSelectedIds(selectableItems.map((item) => item.id)));
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <div className="cart-header__title-group">
                    <h1 className="cart-title">Giỏ hàng của bạn</h1>
                    {cartItems.length > 0 && (
                        <span className="cart-count-pill">
                            {cartItems.length} sản phẩm
                        </span>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <button
                        type="button"
                        className="btn-clear-all"
                        onClick={clearAll}
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon" aria-hidden="true">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </div>
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <p>
                        Khám phá hàng trăm mã nguồn chất lượng cao, dễ cài đặt
                        và sẵn sàng sử dụng ngay.
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        Khám phá mã nguồn
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-left-column">
                        {ownedInCart.length > 0 && (
                            <div className="cart-alert" role="alert">
                                <div className="cart-alert__content">
                                    <strong>
                                        {ownedInCart.length} mã nguồn trong giỏ
                                        bạn đã sở hữu.
                                    </strong>{' '}
                                    Hệ thống tự động bỏ chọn các mã này.
                                </div>
                                <button
                                    type="button"
                                    className="cart-alert__btn"
                                    onClick={() =>
                                        dispatch(
                                            removeManyFromCart(
                                                ownedInCart.map(
                                                    (item) => item.id,
                                                ),
                                            ),
                                        )
                                    }
                                >
                                    Xóa các mã đã sở hữu
                                </button>
                            </div>
                        )}

                        <div className="cart-items">
                            {selectableItems.length > 0 && (
                                <div className="cart-select-bar">
                                    <label className="cart-checkbox cart-checkbox--all">
                                        <input
                                            type="checkbox"
                                            checked={allSelectableChecked}
                                            onChange={handleToggleAll}
                                        />
                                        <span>
                                            Chọn tất cả ({selectedItems.length}/
                                            {selectableItems.length})
                                        </span>
                                    </label>
                                    <Link
                                        to="/products"
                                        className="cart-continue-link"
                                    >
                                        Chọn thêm mã nguồn
                                    </Link>
                                </div>
                            )}

                            <div className="cart-items__list">
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        checked={selectedIds.includes(item.id)}
                                        onToggle={(id) =>
                                            dispatch(toggleSelectItem(id))
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Giữ nguyên hoàn toàn phần thanh toán bên phải */}
                    <div className="cart-summary">
                        <div className="summary-row">
                            <span>Đã chọn:</span>
                            <span>{selectedItems.length} mục</span>
                        </div>
                        <div className="summary-row">
                            <span>Tạm tính:</span>
                            <span>
                                {selectedTotal.toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        <div className="summary-total">
                            <span>Tổng tiền:</span>
                            <span>
                                {selectedTotal.toLocaleString('vi-VN')} đ
                            </span>
                        </div>

                        <button
                            className="btn-checkout"
                            disabled={selectedItems.length === 0}
                            onClick={() => navigate('/checkout')}
                        >
                            {user
                                ? `Tiến hành thanh toán (${selectedItems.length})`
                                : 'Đăng nhập để thanh toán'}
                        </button>

                        {!user && (
                            <p className="cart-guest-note">
                                Bạn có thể giữ giỏ hàng khi chưa đăng nhập. Hệ
                                thống sẽ yêu cầu đăng nhập ở bước thanh toán.
                            </p>
                        )}

                        <ul className="cart-perks">
                            <li>Mua một lần, tải lại không giới hạn</li>
                            <li>
                                Bảo hành {WARRANTY_DAYS} ngày kèm hướng dẫn cài
                                đặt
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;