import {useDispatch} from 'react-redux';
import {removeFromCart} from '../../app/slices/cartSlice';
import type {Product} from '../../libs/types.ts';
import {useToast} from "../../components/common/Toast.tsx";
import {Link} from "react-router-dom";

interface CartItemProps {
    item: Product;
}

export function CartItem({item}: CartItemProps) {
    const dispatch = useDispatch();
    const {showToast} = useToast();

    const handleRemove = () => {
        dispatch(removeFromCart(item.id))
        showToast(`Đã xóa "${item.title}" ra khỏi giỏ`, 'info');
    };

    return (
        <div className="cart-item">
            <Link to={`/products/${item.id}`}>
                <img
                    src={item.thumbnail || 'https://via.placeholder.com/100'}
                    alt={item.title}
                    className="item-img"
                />
            </Link>

            <div className="item-info">
                <h3 className="item-name">
                    <Link to={`/products/${item.id}`} className="item-name-link">
                        {item.title}
                    </Link>
                </h3>
                <div className="item-seller">
                    Người bán: <span>{item.sellerName}</span>
                </div>

                <div className="item-price-group">
                    {item.salePrice !== undefined && item.salePrice < item.price ? (
                            <>
                            <span className="item-price-sale">
                                {item.salePrice.toLocaleString('vi-VN')} đ
                            </span>
                                <span className="item-price-original">
                                {item.price.toLocaleString('vi-VN')} đ
                        </span></>) :
                        (<span className="item-price">
                            {item.price.toLocaleString('vi-VN')} đ
                        </span>)}
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