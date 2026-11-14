import { Link } from 'react-router-dom'
import type { Category } from '../../libs/types'

interface CategoryGridProps {
    categories: Category[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
    onRetry: () => void
}

function CategoryGrid({ categories, status, error, onRetry }: CategoryGridProps) {
    return (
        <section className="home-section">
            <div className="home-section__heading">
                <div>
                    <span className="home-section__eyebrow">DANH MỤC</span>
                    <h2>Tìm theo lĩnh vực</h2>
                </div>
                <Link to="/products">Xem tất cả <span aria-hidden="true">→</span></Link>
            </div>
            {(status === 'idle' || status === 'loading') && (
                <div className="home-category-grid" aria-label="Đang tải danh mục">
                    {Array.from({ length: 6 }, (_, index) => <div className="home-category-skeleton" key={index} />)}
                </div>
            )}
            {status === 'failed' && (
                <div className="home-message" role="alert">
                    <p>{error ?? 'Không tải được danh mục.'}</p>
                    <button type="button" onClick={onRetry}>Thử lại</button>
                </div>
            )}
            {status === 'succeeded' && categories.length === 0 && (
                <p className="home-message">Chưa có danh mục để hiển thị.</p>
            )}
            {status === 'succeeded' && categories.length > 0 && (
                <div className="home-category-grid">
                    {categories.map((category) => (
                        <Link
                            className="home-category-card"
                            key={category.id}
                            to={`/products?category=${encodeURIComponent(category.slug)}`}
                        >
                            <span className="home-category-card__icon" aria-hidden="true">{category.icon ?? '⌘'}</span>
                            <span className="home-category-card__name">{category.name}</span>
                            <span className="home-category-card__description">{category.description}</span>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    )
}

export default CategoryGrid
