import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { addToCart } from '../app/slices/cartSlice'
import { fetchOne, fetchRelated } from '../app/slices/productSlice'
import ProductCard from '../components/common/ProductCard'
import { useToast } from '../components/common/Toast'

const price = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

function ProductDetailPage() {
    const { id = '' } = useParams()
    const dispatch = useAppDispatch()
    const { detail, detailStatus, related } = useAppSelector((state) => state.products)
    const { showToast } = useToast()

    useEffect(() => { dispatch(fetchOne(id)) }, [dispatch, id])
    useEffect(() => { if (detail?.id === id) dispatch(fetchRelated({ category: detail.categoryId ?? detail.category, currentProductId: id })) }, [dispatch, detail, id])

    if (detailStatus === 'loading' || detailStatus === 'idle') return <main className="product-detail-page"><div className="loading"><span className="loading__spinner" />Đang tải thông tin...</div></main>
    if (detailStatus === 'failed' || !detail || detail.id !== id) return <main className="catalog-empty product-detail-empty"><h1>Không tìm thấy sản phẩm</h1><p>Sản phẩm có thể đã được ẩn hoặc đường dẫn không còn hợp lệ.</p><Link to="/products">Quay lại danh mục</Link></main>

    return <main className="product-detail-page">
        <nav className="breadcrumbs" aria-label="Đường dẫn"><Link to="/">Trang chủ</Link><span>/</span><Link to="/products">Sản phẩm</Link><span>/</span><span>{detail.title}</span></nav>
        <div className="product-detail-layout">
            <div className="product-detail-image">{detail.thumbnail ? <img src={detail.thumbnail} alt={`Ảnh xem trước ${detail.title}`} /> : <div>Chưa có ảnh xem trước</div>}</div>
            <section className="product-detail-summary">
                <span className="product-detail-category">{detail.category}</span>
                <h1>{detail.title}</h1>
                <p className="product-detail-rating">★ {detail.rating?.toFixed(1) ?? 'Chưa có đánh giá'} <span>·</span> {detail.reviewCount ?? 0} đánh giá <span>·</span> {detail.downloads.toLocaleString('vi-VN')} lượt tải</p>
                <p className="product-detail-description">{detail.description}</p>
                <div className="product-detail-price">{detail.salePrice !== undefined && detail.salePrice < detail.price ? <><strong>{price(detail.salePrice)}</strong><del>{price(detail.price)}</del></> : <strong>{price(detail.price)}</strong>}</div>
                <button className="product-detail-buy" onClick={() => { dispatch(addToCart(detail)); showToast('Đã thêm sản phẩm vào giỏ hàng', 'success') }}>Thêm vào giỏ hàng</button>
                {detail.demoUrl && <a className="product-detail-demo" href={detail.demoUrl} target="_blank" rel="noreferrer">Xem bản demo ↗</a>}
                <div className="product-detail-facts"><span>Phiên bản<strong>{detail.version}</strong></span><span>Bản quyền<strong>{detail.license}</strong></span><span>Định dạng<strong>Mã nguồn tải về</strong></span></div>
                <ul className="product-detail-tech">{detail.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
            </section>
        </div>
        <section className="product-detail-info"><div><span className="home-section__eyebrow">THÔNG TIN SẢN PHẨM</span><h2>Mô tả & tính năng</h2><p>{detail.description}</p><ul>{detail.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><aside><h3>Hướng dẫn sử dụng</h3><p>{detail.usage || 'Thông tin hướng dẫn sẽ được cung cấp cùng sản phẩm sau khi mua.'}</p></aside></section>
        {related.length > 0 && <section className="home-section product-related"><div className="home-section__heading"><div><span className="home-section__eyebrow">CÙNG DANH MỤC</span><h2>Sản phẩm liên quan</h2></div><Link to="/products">Xem tất cả →</Link></div><div className="home-product-grid">{related.slice(0, 4).map((item) => <ProductCard product={item} key={item.id} />)}</div></section>}
    </main>
}

export default ProductDetailPage
