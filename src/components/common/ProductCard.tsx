import { useState } from 'react'
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
    const hasDiscount =
        product.salePrice !== undefined &&
        product.salePrice < product.price

    return (
        <article className="product-card">
            <div className="product-card__image">
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
            </div>

            <div className="product-card__content">
                <p className="product-card__category">{product.category}</p>
                <h3 className="product-card__title">{product.title}</h3>

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
            </div>
        </article>
    )
}

export default ProductCard