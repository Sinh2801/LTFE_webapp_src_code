import { Link } from 'react-router-dom'
import ProductCard from '../common/ProductCard'
import type { Product } from '../../libs/types'

interface FeaturedSectionProps {
    products: Product[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
    onRetry: () => void
}

function FeaturedSection({ products, status, error, onRetry }: FeaturedSectionProps) {
    return (
        <section className="home-section home-featured">
            <div className="home-section__heading">
                <div>
                    <span className="home-section__eyebrow">ĐƯỢC QUAN TÂM</span>
                    <h2>Sản phẩm nổi bật</h2>
                </div>
                <Link to="/products">Khám phá thêm <span aria-hidden="true">→</span></Link>
            </div>
            {(status === 'idle' || status === 'loading') && (
                <div className="home-product-grid" aria-label="Đang tải sản phẩm">
                    {Array.from({ length: 4 }, (_, index) => (
                        <div className="home-product-skeleton" key={index}>
                            <div />
                            <span />
                            <span />
                            <span />
                        </div>
                    ))}
                </div>
            )}
            {status === 'failed' && (
                <div className="home-message" role="alert">
                    <p>{error ?? 'Không tải được sản phẩm nổi bật.'}</p>
                    <button type="button" onClick={onRetry}>Thử lại</button>
                </div>
            )}
            {status === 'succeeded' && products.length === 0 && (
                <p className="home-message">Chưa có sản phẩm nổi bật.</p>
            )}
            {status === 'succeeded' && products.length > 0 && (
                <div className="home-product-grid">
                    {products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            )}
        </section>
    )
}

export default FeaturedSection
