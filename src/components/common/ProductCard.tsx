import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { addToCart } from '../../app/slices/cartSlice'
import { toggleFavorite } from '../../app/slices/favoritesSlice'
import { selectIsOwned } from '../../app/slices/librarySlice'
import { useToast } from './Toast'
import type { Product } from '../../libs/types'

interface ProductCardProps {
    product: Product
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price)

function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false)
    const dispatch = useAppDispatch()
    const { showToast } = useToast()
    const owned = useAppSelector(selectIsOwned(product.id))
    const isFavorite = useAppSelector((state) => state.favorites.items.some((item) => item.id === product.id))
    const hasDiscount =
        product.salePrice !== undefined &&
        product.salePrice < product.price

    return (
        <article className="product-card">
            <Link className="product-card__image" to={`/products/${product.id}`} aria-label={`Xem ${product.title}`}>
                {product.thumbnail && !imageError ? (
                    <img
                        src={product.thumbnail}
                        alt={`Ảnh xem trước của ${product.title}`}
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="product-card__image-placeholder">
                        Chưa có ảnh
                    </div>
                )}
                {owned ? <span className="product-card__badge product-card__badge--owned">Đã sở hữu</span> : product.featured && <span className="product-card__badge">Hot</span>}
            </Link>
            <button className={`product-card__favorite ${isFavorite ? 'is-active' : ''}`} aria-label={isFavorite ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'} aria-pressed={isFavorite} onClick={() => dispatch(toggleFavorite(product))}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="heart-icon">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </button>

            <div className="product-card__content">
                <p className="product-card__category">{product.category}</p>
                <h3 className="product-card__title"><Link to={`/products/${product.id}`}>{product.title}</Link></h3>
                <p className="product-card__meta">★ {product.rating?.toFixed(1) ?? 'Mới'} <span>·</span> {product.downloads.toLocaleString('vi-VN')} lượt tải</p>

                <ul className="product-card__technologies">
                    {product.technologies.map((technology) => (
                        <li key={technology}>{technology}</li>
                    ))}
                </ul>

                <div className="product-card__price">
                    {hasDiscount ? (
                        <>
                            <span className="product-card__sale-price">
                                {formatPrice(product.salePrice!)}
                            </span>
                            <del className="product-card__original-price">
                                {formatPrice(product.price)}
                            </del>
                        </>
                    ) : (
                        <span className="product-card__regular-price">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>
                <div className="product-card__actions">
                    <Link className="product-card__details" to={`/products/${product.id}`}>Chi tiết</Link>
                    {owned
                        ? <Link className="product-card__owned-link" to="/profile?tab=da-mua">Tải về</Link>
                        : <button type="button" onClick={() => { dispatch(addToCart(product)); showToast('Đã thêm sản phẩm vào giỏ hàng', 'success') }}>Thêm vào giỏ</button>}
                </div>
            </div>
        </article>
    )
}

export default ProductCard
