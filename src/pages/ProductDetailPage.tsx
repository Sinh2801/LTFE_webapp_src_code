import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { fetchOne, fetchRelated } from '../app/slices/productSlice'
import ProductCard from '../components/common/ProductCard'
import { Stars } from '../components/common/Stars'
import BuyBox from '../components/product/BuyBox'
import type { DetailTab } from '../components/product/BuyBox'
import ProductTabs from '../components/product/ProductTabs'

const TABS: DetailTab[] = ['mo-ta', 'cai-dat', 'bao-hanh', 'danh-gia']

function ProductDetailPage() {
    const { id = '' } = useParams()
    const dispatch = useAppDispatch()
    const { detail, detailStatus, related } = useAppSelector((state) => state.products)
    const reviewState = useAppSelector((state) => state.reviews)
    const [params, setParams] = useSearchParams()
    const requestedTab = params.get('tab') as DetailTab | null
    const tab: DetailTab = requestedTab && TABS.includes(requestedTab) ? requestedTab : 'mo-ta'

    useEffect(() => { dispatch(fetchOne(id)) }, [dispatch, id])
    useEffect(() => { if (detail?.id === id) dispatch(fetchRelated({ category: detail.categoryId ?? detail.category, currentProductId: id })) }, [dispatch, detail, id])
    useEffect(() => { if (detail?.id === id) document.title = `${detail.title} | SourceCodeTST` }, [detail, id])

    function selectTab(next: DetailTab) {
        const nextParams = new URLSearchParams(params)
        nextParams.set('tab', next)
        setParams(nextParams, { replace: true })
        window.setTimeout(() => document.getElementById('chi-tiet-tab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
    }

    if (detailStatus === 'loading' || detailStatus === 'idle') return <main className="product-detail-page"><div className="loading"><span className="loading__spinner" />Đang tải thông tin...</div></main>
    if (detailStatus === 'failed' || !detail || detail.id !== id) return <main className="catalog-empty product-detail-empty"><h1>Không tìm thấy sản phẩm</h1><p>Sản phẩm có thể đã được ẩn hoặc đường dẫn không còn hợp lệ.</p><Link to="/products">Quay lại danh mục</Link></main>
    const liveSummary = reviewState.productId === detail.id && reviewState.summary && reviewState.summary.count > 0 ? reviewState.summary : null
    const average = liveSummary ? liveSummary.average : detail.rating ?? 0
    const count = liveSummary ? liveSummary.count : detail.reviewCount ?? 0

    return <main className="product-detail-page">
        <div className="product-detail-layout">
            <div className="product-detail-image">{detail.thumbnail ? <img src={detail.thumbnail} alt={`Ảnh xem trước ${detail.title}`} /> : <div>Chưa có ảnh xem trước</div>}</div>
            <section className="product-detail-summary">
                <span className="product-detail-category">{detail.category}</span>
                <h1>{detail.title}</h1>
                <p className="product-detail-rating">
                    {count > 0 ? <><Stars value={average} size={15} /> <strong>{average.toFixed(1)}</strong></> : 'Chưa có đánh giá'}
                    <span>·</span>
                    <button type="button" className="link-button" onClick={() => selectTab('danh-gia')}>{count.toLocaleString('vi-VN')} đánh giá</button>
                    <span>·</span>{detail.downloads.toLocaleString('vi-VN')} lượt tải
                </p>
                <p className="product-detail-description">{detail.description}</p>
                <BuyBox product={detail} onSelectTab={selectTab} />
                <div className="product-detail-facts"><span>Phiên bản<strong>{detail.version}</strong></span><span>Bản quyền<strong>{detail.license}</strong></span><span>Định dạng<strong>Mã nguồn tải về</strong></span></div>
                <ul className="product-detail-tech">{detail.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
            </section>
        </div>
        <div id="chi-tiet-tab"><ProductTabs product={detail} tab={tab} onChange={selectTab} /></div>
        {related.length > 0 && <section className="home-section product-related"><div className="home-section__heading"><div><span className="home-section__eyebrow">CÙNG DANH MỤC</span><h2>Sản phẩm liên quan</h2></div><Link to="/products">Xem tất cả →</Link></div><div className="home-product-grid">{related.slice(0, 4).map((item) => <ProductCard product={item} key={item.id} />)}</div></section>}
    </main>
}

export default ProductDetailPage
