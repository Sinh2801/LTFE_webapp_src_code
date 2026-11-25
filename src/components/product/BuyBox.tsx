import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { addToCart } from '../../app/slices/cartSlice'
import { toggleFavorite } from '../../app/slices/favoritesSlice'
import { selectIsOwned } from '../../app/slices/librarySlice'
import { useToast } from '../common/Toast'
import { useDownload } from '../../hooks/useDownload'
import { formatDate, formatPrice, hasDiscount } from '../../libs/format'
import type { Product } from '../../libs/types'
import { WARRANTY_DAYS, warrantyFrom } from '../../libs/warranty'
import { ExternalLink, Heart } from 'lucide-react';

export type DetailTab = 'mo-ta' | 'cai-dat' | 'bao-hanh' | 'danh-gia'

interface BuyBoxProps {
    product: Product
    onSelectTab: (tab: DetailTab) => void
}

const BENEFITS = [
    'Mua một lần, tải lại code không giới hạn',
    `Bảo hành ${WARRANTY_DAYS} ngày kể từ ngày mua`,
    'Hướng dẫn cài đặt chi tiết từng bước',
    'Hỗ trợ kỹ thuật khi gặp lỗi cài đặt',
]

function BuyBox({ product, onSelectTab }: BuyBoxProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { download, busyId } = useDownload()
    const user = useAppSelector((state) => state.auth.user)
    const owned = useAppSelector(selectIsOwned(product.id))
    const purchase = useAppSelector((state) => state.library.items.find((item) => item.id === product.id))
    const inCart = useAppSelector((state) => state.cart.items.some((item) => item.id === product.id))
    const isFavorite = useAppSelector((state) => state.favorites.items.some((item) => item.id === product.id))

    function handleAdd() {
        dispatch(addToCart(product))
        showToast('Đã thêm sản phẩm vào giỏ hàng', 'success')
    }

    function handleBuyNow() {
        dispatch(addToCart(product))
        navigate('/checkout')
    }

    const warranty = purchase ? warrantyFrom(purchase.purchasedAt) : null

    return (
        <div className="buy-box">
            <div className="product-detail-price">
                {hasDiscount(product)
                    ? <><strong>{formatPrice(product.salePrice as number)}</strong><del>{formatPrice(product.price)}</del><span className="badge badge--hot">-{Math.round((1 - (product.salePrice as number) / product.price) * 100)}%</span></>
                    : <strong>{formatPrice(product.price)}</strong>}
            </div>

            {owned && purchase ? (
                <div className="owned-panel">
                    <p className="owned-panel__title">✓ Bạn đã sở hữu sản phẩm này</p>
                    <p className="owned-panel__meta">
                        Mua ngày {formatDate(purchase.purchasedAt)} · đã tải {purchase.downloadCount} lần
                        {warranty && <> · {warranty.active ? `còn ${warranty.daysLeft} ngày bảo hành` : 'đã hết hạn bảo hành'}</>}
                    </p>
                    <button type="button" className="product-detail-buy" disabled={busyId === product.id} onClick={() => download(product.id)}>
                        {busyId === product.id ? 'Đang tải...' : 'Tải mã nguồn (.zip)'}
                    </button>
                    <div className="owned-panel__links">
                        <button type="button" onClick={() => onSelectTab('cai-dat')}>Hướng dẫn cài đặt</button>
                        <button type="button" onClick={() => onSelectTab('danh-gia')}>Viết đánh giá</button>
                        <Link to={`/profile?tab=bao-hanh&product=${product.id}`}>Yêu cầu bảo hành</Link>
                    </div>
                </div>
            ) : (
                <div className="buy-actions">
                    <button type="button" className="product-detail-buy" onClick={handleBuyNow}>Mua ngay</button>
                    {inCart
                        ? <Link className="btn-outline" to="/cart">Đã có trong giỏ · Xem giỏ hàng</Link>
                        : <button type="button" className="btn-outline" onClick={handleAdd}>Thêm vào giỏ hàng</button>}
                    {!user && <p className="buy-box__hint">Bạn có thể xem và thêm vào giỏ khi chưa đăng nhập. <Link to="/login" state={{ from: `/products/${product.id}` }}>Đăng nhập</Link> để thanh toán và tải mã nguồn.</p>}
                </div>
            )}

            <div className="buy-box__secondary">
                {product.demoUrl && (<a className="product-detail-demo" href={product.demoUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} strokeWidth={2.2} /><span>Xem bản demo</span></a>)}
                <button type="button" className={`buy-box__fav ${isFavorite ? 'is-active' : ''}`} aria-pressed={isFavorite} onClick={() => dispatch(toggleFavorite(product))}>
                    <Heart size={16} strokeWidth={2.2} fill={isFavorite ? 'currentColor' : 'none'}/>
                    <span>{isFavorite ? 'Đã lưu yêu thích' : 'Lưu vào yêu thích'}</span>
                </button>
            </div>
            <ul className="benefit-list">
                {BENEFITS.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <button type="button" className="buy-box__policy" onClick={() => onSelectTab('bao-hanh')}>Xem chính sách bảo hành →</button>
        </div>
    )
}

export default BuyBox
