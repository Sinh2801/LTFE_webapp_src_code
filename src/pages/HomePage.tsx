import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { fetchCategories } from '../app/slices/categorySlice'
import { fetchFeatured, fetchList } from '../app/slices/productSlice'
import CategoryGrid from '../components/home/CategoryGrid'
import TechMarquee from '../components/home/TechMarquee'
import CustomerReviews from '../components/home/CustomerReviews'
import FeaturedSection from '../components/home/FeaturedSection'
import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import StoreBanner from '../components/home/StoreBanner'
import ProductCard from '../components/common/ProductCard'
import { Link } from 'react-router-dom'
import blogMainImg from '../assets/blog-thumb-main.png'
import blogImg1 from '../assets/blog-thumb-1.png'
import blogImg2 from '../assets/blog-thumb-2.png'
import blogImg3 from '../assets/blog-thumb-3.png'

function HomePage() {
    const dispatch = useAppDispatch()
    const categories = useAppSelector((state) => state.categories)
    const products = useAppSelector((state) => state.products)
    const latestSliderRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    function updateSliderButtons() {
        if (!latestSliderRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = latestSliderRef.current
        setCanScrollLeft(scrollLeft > 6)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6)
    }

    function scrollLatest(direction: 'left' | 'right') {
        if (!latestSliderRef.current) return
        const container = latestSliderRef.current
        const item = container.querySelector<HTMLElement>('.home-slider-item')
        const scrollAmount = item ? item.offsetWidth + 20 : 300
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        dispatch(fetchCategories())
        dispatch(fetchFeatured())
        dispatch(fetchList({ page: 1, limit: 12, sort: 'newest' }))
    }, [dispatch])

    useEffect(() => {
        updateSliderButtons()
    }, [products.list])

    return (
        <main className="home-page">
            <Hero />
            <CategoryGrid
                categories={categories.items}
                status={categories.status}
                error={categories.error}
                onRetry={() => dispatch(fetchCategories())}
            />
            <TechMarquee />
            <FeaturedSection
                products={products.featured}
                status={products.featuredStatus}
                error={products.error}
                onRetry={() => dispatch(fetchFeatured())}
            />
            <section className="home-section home-latest">
                <div className="home-section__heading home-latest-heading">
                    <div>
                        <span className="home-section__eyebrow">CẬP NHẬT MỖI TUẦN</span>
                        <h2>Mã nguồn <span>mới nhất</span></h2>
                    </div>
                    <Link className="home-category-all" to="/products?sort=newest">Xem tất cả <span aria-hidden="true">→</span></Link>
                </div>
                {products.listStatus === 'loading' && <div className="loading"><span className="loading__spinner" />Đang cập nhật sản phẩm...</div>}
                {products.listStatus === 'succeeded' && products.list.length > 0 && (
                    <div className="home-slider-container">
                        <button
                            type="button"
                            className={`home-slider-arrow home-slider-arrow--left ${!canScrollLeft ? 'is-disabled' : ''}`}
                            onClick={() => scrollLatest('left')}
                            disabled={!canScrollLeft}
                            aria-label="Sản phẩm trước"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <div
                            className="home-slider-track"
                            ref={latestSliderRef}
                            onScroll={updateSliderButtons}
                        >
                            {products.list.map((product) => (
                                <div className="home-slider-item" key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className={`home-slider-arrow home-slider-arrow--right ${!canScrollRight ? 'is-disabled' : ''}`}
                            onClick={() => scrollLatest('right')}
                            disabled={!canScrollRight}
                            aria-label="Sản phẩm tiếp theo"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m9 6 6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                )}
                {products.listStatus === 'succeeded' && products.list.length === 0 && <p className="home-message">Sản phẩm mới sẽ được cập nhật tại đây.</p>}
            </section>
            <HowItWorks />
            <section className="home-section home-tech-corner" id="tin-tuc">
                <div className="home-section__heading home-tech-heading">
                    <div>
                        <span className="home-section__eyebrow">TIN CÔNG NGHỆ</span>
                        <h2>Góc <span>công nghệ</span></h2>
                    </div>
                    <Link className="home-category-all" to="/products">
                        Xem tất cả bài viết <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="tech-corner-grid">
                    <article className="tech-card-featured">
                        <img src={blogMainImg} alt="Kinh nghiệm chọn mã nguồn" className="tech-card-featured__bg" />
                        <div className="tech-card-featured__overlay"></div>
                        <div className="tech-card-featured__content">
                            <div className="tech-tag-row">
                                <span className="tech-badge tech-badge--yellow">TƯ VẤN</span>
                                <time className="tech-date">11/10/2026</time>
                            </div>
                            <h3>React hay Next.js: đâu là lựa chọn tối ưu cho dự án web 2026?</h3>
                            <p>Phân tích ưu nhược điểm, hiệu năng SEO và khả năng mở rộng của hai nền tảng công nghệ phổ biến nhất hiện nay.</p>
                        </div>
                    </article>

                    <div className="tech-side-list">
                        <article className="tech-card-side">
                            <div className="tech-card-side__thumb">
                                <img src={blogImg1} alt="7 tiêu chí cần kiểm tra trước khi mua source code" />
                            </div>
                            <div className="tech-card-side__body">
                                <div className="tech-tag-row">
                                    <span className="tech-badge tech-badge--yellow">KINH NGHIỆM</span>
                                    <time className="tech-date">11/10/2026</time>
                                </div>
                                <h4>7 tiêu chí cần kiểm tra trước khi mua một bộ Source Code</h4>
                            </div>
                        </article>

                        <article className="tech-card-side">
                            <div className="tech-card-side__thumb">
                                <img src={blogImg2} alt="Java Spring Boot hay Node.js" />
                            </div>
                            <div className="tech-card-side__body">
                                <div className="tech-tag-row">
                                    <span className="tech-badge tech-badge--yellow">KIẾN THỨC</span>
                                    <time className="tech-date">11/10/2026</time>
                                </div>
                                <h4>Java Spring Boot hay Node.js: Nên chọn công nghệ nào để xây dựng Backend?</h4>
                            </div>
                        </article>

                        <article className="tech-card-side">
                            <div className="tech-card-side__thumb">
                                <img src={blogImg3} alt="Hướng dẫn cài đặt và triển khai website lên hosting" />
                            </div>
                            <div className="tech-card-side__body">
                                <div className="tech-tag-row">
                                    <span className="tech-badge tech-badge--yellow">HƯỚNG DẪN</span>
                                    <time className="tech-date">11/10/2026</time>
                                </div>
                                <h4>Hướng dẫn cài đặt và triển khai Website từ Source Code lên Hosting</h4>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
            <CustomerReviews />
            <StoreBanner />
        </main>
    )
}

export default HomePage
