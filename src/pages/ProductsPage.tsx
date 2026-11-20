import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { fetchCategories } from '../app/slices/categorySlice'
import { fetchList } from '../app/slices/productSlice'
import ProductCard from '../components/common/ProductCard'
import type { ProductSort } from '../libs/types'

const sorts: { value: ProductSort; label: string }[] = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến' },
    { value: 'rating', label: 'Đánh giá cao' },
    { value: 'price_asc', label: 'Giá thấp đến cao' },
    { value: 'price_desc', label: 'Giá cao đến thấp' },
]

function ProductsPage() {
    const dispatch = useAppDispatch()
    const { list, listStatus, pagination, error } = useAppSelector((state) => state.products)
    const categories = useAppSelector((state) => state.categories.items)
    const [params, setParams] = useSearchParams()
    const [keyword, setKeyword] = useState(params.get('q') ?? '')
    const category = params.get('category') ?? ''
    const sort = (params.get('sort') ?? 'newest') as ProductSort
    const page = Number(params.get('page') ?? 1)
    const [technology, setTechnology] = useState(params.get('tech') ?? '')

    useEffect(() => { dispatch(fetchCategories()) }, [dispatch])
    useEffect(() => {
        const timer = window.setTimeout(() => setKeyword(params.get('q') ?? ''), 0)
        return () => window.clearTimeout(timer)
    }, [params])
    useEffect(() => {
        dispatch(fetchList({ page, limit: 9, q: params.get('q') ?? undefined, category: category || undefined, tech: technology || undefined, sort }))
    }, [dispatch, page, params, category, technology, sort])

    const selectedCategory = useMemo(() => categories.find((item) => item.slug === category || item.id === category)?.name, [categories, category])
    const update = (key: string, value: string) => {
        const next = new URLSearchParams(params)
        if (value) next.set(key, value); else next.delete(key)
        next.delete('page')
        setParams(next)
    }

    return (
        <main className="catalog-page">
            <div className="catalog-intro">
                <span className="home-section__eyebrow">SOURCECODETST STORE</span>
                <h1>Kho mã nguồn dành cho dự án của bạn</h1>
                <p>Tìm, xem trước và chọn mã nguồn phù hợp theo lĩnh vực, công nghệ và ngân sách.</p>
            </div>
            <form className="catalog-search" onSubmit={(event) => { event.preventDefault(); update('q', keyword.trim()) }}>
                <label className="sr-only" htmlFor="catalog-query">Tìm mã nguồn</label>
                <input id="catalog-query" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Bạn đang tìm website, ứng dụng nào?" />
                <button type="submit">Tìm kiếm</button>
            </form>
            <div className="catalog-toolbar">
                <div className="catalog-filters">
                    <label>Danh mục
                        <select value={category} onChange={(event) => update('category', event.target.value)}>
                            <option value="">Tất cả lĩnh vực</option>
                            {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
                        </select>
                    </label>
                    <label>Công nghệ
                        <input value={technology} onChange={(event) => { setTechnology(event.target.value); update('tech', event.target.value) }} placeholder="React, Laravel..." />
                    </label>
                </div>
                <label className="catalog-sort">Sắp xếp
                    <select value={sort} onChange={(event) => update('sort', event.target.value)}>
                        {sorts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                </label>
            </div>
            <div className="catalog-results-heading"><h2>{selectedCategory || (params.get('q') ? `Kết quả cho “${params.get('q')}”` : 'Tất cả mã nguồn')}</h2><span>{pagination.total} sản phẩm</span></div>
            {listStatus === 'loading' && <div className="loading"><span className="loading__spinner" />Đang tải sản phẩm...</div>}
            {listStatus === 'failed' && <div className="catalog-empty"><h3>Chưa tải được danh mục</h3><p>{error}</p><button onClick={() => dispatch(fetchList({ page, limit: 9, q: params.get('q') ?? undefined, category: category || undefined, tech: technology || undefined, sort }))}>Thử lại</button></div>}
            {listStatus === 'succeeded' && list.length === 0 && <div className="catalog-empty"><span>⌕</span><h3>Chưa tìm thấy mã nguồn phù hợp</h3><p>Thử đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm sản phẩm.</p><button onClick={() => { setTechnology(''); setKeyword(''); setParams({}) }}>Xóa bộ lọc</button></div>}
            {listStatus === 'succeeded' && list.length > 0 && <div className="catalog-grid">{list.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
            {pagination.totalPages > 1 && <nav className="pagination" aria-label="Phân trang">
                <button className="pagination__button" disabled={page <= 1} onClick={() => update('page', String(page - 1))}>←</button>
                {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((number) => <button key={number} className="pagination__button" aria-current={number === page ? 'page' : undefined} onClick={() => update('page', String(number))}>{number}</button>)}
                <button className="pagination__button" disabled={page >= pagination.totalPages} onClick={() => update('page', String(page + 1))}>→</button>
            </nav>}
        </main>
    )
}

export default ProductsPage
