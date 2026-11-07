import { useDispatch } from 'react-redux';
import { removeFromCart } from '../../app/slices/cartSlice';
import type { Product } from '../../libs/types.ts';

interface CartItemProps {
    item: Product;
}

export function CartItem({ item }: CartItemProps) {
    const dispatch = useDispatch();

    const handleRemove = () => {
        if (window.confirm(`Bạn có chắc muốn xóa "${item.title}" khỏi giỏ hàng?`)) {
            dispatch(removeFromCart(item.id));
        }
    };

    return (
        <div className="cart-item">
            <img
                src={item.thumbnail || 'https://via.placeholder.com/100'}
                alt={item.title}
                className="item-img"
            />

            <div className="item-info">
                <h3 className="item-name">{item.title}</h3>

                <div className="item-price">
                    {(item.salePrice ?? item.price).toLocaleString('vi-VN')} đ
                </div>
            </div>

            <div className="item-actions">
                <button
                    className="btn-remove"
                    onClick={handleRemove}
                >
                    Xóa
                </button>
            </div>
        </div>
    );
}