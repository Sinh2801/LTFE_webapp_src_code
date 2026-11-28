import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { fetchCategories } from '../app/slices/categorySlice'
import { fetchList } from '../app/slices/productSlice'
import ProductCard from '../components/common/ProductCard'
import FilterSidebar, { type ProductFilterValues } from '../components/product/FilterSidebar.tsx'
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
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    const q = params.get('q') ?? ''
    const category = params.get('category') ?? ''
    const tech = params.get('tech') ?? ''
    const minPrice = params.get('minPrice') ?? ''
    const maxPrice = params.get('maxPrice') ?? ''
    const rating = params.get('rating') ?? ''
    const onSale = params.get('sale') === '1'
    const sort = (params.get('sort') ?? 'newest') as ProductSort
    const page = Number(params.get('page') ?? 1)

    const queryParams = useMemo(
        () => ({
            page,
            limit: 9,
            q: q || undefined,
            category: category || undefined,
            tech: tech || undefined,
            minPrice: minPrice !== '' ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
            rating: rating !== '' ? Number(rating) : undefined,
            onSale: onSale || undefined,
            sort,
        }),
        [page, q, category, tech, minPrice, maxPrice, rating, onSale, sort]
    )

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    useEffect(() => {
        const timer = window.setTimeout(() => setKeyword(q), 0)
        return () => window.clearTimeout(timer)
    }, [q])

    useEffect(() => {
        dispatch(fetchList(queryParams))
    }, [dispatch, queryParams])

    const selectedCategory = useMemo(
        () => categories.find((item) => item.slug === category || item.id === category)?.name,
        [categories, category]
    )

    const update = (key: string, value: string) => {
        const next = new URLSearchParams(params)
        if (value) next.set(key, value)
        else next.delete(key)
        if (key !== 'page') next.delete('page')
        setParams(next)
    }

    const updateFilters = (updates: Partial<ProductFilterValues>) => {
        const next = new URLSearchParams(params)
        if (updates.category !== undefined) {
            if (updates.category) next.set('category', updates.category)
            else next.delete('category')
        }
        if (updates.tech !== undefined) {
            if (updates.tech) next.set('tech', updates.tech)
            else next.delete('tech')
        }
        if (updates.minPrice !== undefined) {
            if (updates.minPrice) next.set('minPrice', updates.minPrice)
            else next.delete('minPrice')
        }
        if (updates.maxPrice !== undefined) {
            if (updates.maxPrice) next.set('maxPrice', updates.maxPrice)
            else next.delete('maxPrice')
        }
        if (updates.rating !== undefined) {
            if (updates.rating) next.set('rating', updates.rating)
            else next.delete('rating')
        }
        if (updates.onSale !== undefined) {
            if (updates.onSale) next.set('sale', '1')
            else next.delete('sale')
        }
        next.delete('page')
        setParams(next)
    }

    const handleResetAll = () => {
        setKeyword('')
        setParams({})
    }

    const activeFilterCount =
        Number(Boolean(category)) +
        Number(Boolean(tech)) +
        Number(Boolean(minPrice || maxPrice)) +
        Number(Boolean(rating)) +
        Number(onSale)

    return (
        <main className="catalog-page">
            <div className="catalog-intro">
                <h1>Kho mã nguồn dành cho dự án của bạn</h1>
                <p>Tìm, xem trước và chọn mã nguồn phù hợp theo lĩnh vực, công nghệ và ngân sách.</p>
            </div>

            <form
                className="catalog-search"
                onSubmit={(event) => {
                    event.preventDefault()
                    update('q', keyword.trim())}}>
                <label className="sr-only" htmlFor="catalog-query">
                    Tìm mã nguồn
                </label>
                <input id="catalog-query" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Bạn đang tìm website, ứng dụng nào?"/>
                <button type="submit">Tìm kiếm</button>
            </form>

            <div className="catalog-layout">
                <FilterSidebar categories={categories} filters={{ category, tech, minPrice, maxPrice, rating, onSale }} onChange={updateFilters} onReset={handleResetAll} isOpenMobile={isMobileFilterOpen} onCloseMobile={() => setIsMobileFilterOpen(false)}/>

                <div className="catalog-main">
                    <div className="catalog-topbar">
                        <div className="catalog-topbar__left">
                            <button type="button" className="catalog-mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
                                </svg>
                                <span>Bộ lọc</span>
                                {activeFilterCount > 0 && (
                                    <em className="catalog-filter-badge">{activeFilterCount}</em>
                                )}
                            </button>

                            <div className="catalog-results-heading">
                                <h2>{selectedCategory || (q ? `Kết quả cho “${q}”` : 'Tất cả mã nguồn')}</h2>
                                <span>{pagination.total} sản phẩm</span>
                            </div>
                        </div>

                        <label className="catalog-sort">
                            <span>Sắp xếp</span>
                            <select value={sort} onChange={(event) => update('sort', event.target.value)}>
                                {sorts.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {activeFilterCount > 0 && (
                        <div className="catalog-active-chips">
                            {selectedCategory && (
                                <button type="button" className="catalog-chip" onClick={() => updateFilters({ category: '' })}>
                                    <span>Danh mục: {selectedCategory}</span>
                                    <span aria-hidden="true">×</span>
                                </button>
                            )}
                            {tech && (
                                <button type="button" className="catalog-chip" onClick={() => updateFilters({ tech: '' })}>
                                    <span>Công nghệ: {tech}</span>
                                    <span aria-hidden="true">×</span>
                                </button>
                            )}
                            {(minPrice || maxPrice) && (
                                <button type="button" className="catalog-chip" onClick={() => updateFilters({ minPrice: '', maxPrice: '' })}>
                                    <span>
                                        Giá:{' '}
                                        {minPrice ? `${Number(minPrice).toLocaleString('vi-VN')}đ` : '0đ'}
                                        {' - '}
                                        {maxPrice ? `${Number(maxPrice).toLocaleString('vi-VN')}đ` : 'Trở lên'}
                                    </span>
                                    <span aria-hidden="true">×</span>
                                </button>
                            )}
                            {rating && (
                                <button type="button" className="catalog-chip" onClick={() => updateFilters({ rating: '' })}>
                                    <span>Đánh giá: Từ {rating}★</span>
                                    <span aria-hidden="true">×</span>
                                </button>
                            )}
                            {onSale && (
                                <button type="button" className="catalog-chip" onClick={() => updateFilters({ onSale: false })}>
                                    <span>Đang giảm giá</span>
                                    <span aria-hidden="true">×</span>
                                </button>
                            )}
                            <button type="button" className="catalog-chip-clear" onClick={handleResetAll}>
                                Xóa tất cả
                            </button>
                        </div>
                    )}

                    {listStatus === 'loading' && (
                        <div className="loading">
                            <span className="loading__spinner" />
                            Đang tải sản phẩm...
                        </div>
                    )}

                    {listStatus === 'failed' && (
                        <div className="catalog-empty">
                            <h3>Chưa tải được danh mục</h3>
                            <p>{error}</p>
                            <button onClick={() => dispatch(fetchList(queryParams))}>Thử lại</button>
                        </div>
                    )}

                    {listStatus === 'succeeded' && list.length === 0 && (
                        <div className="catalog-empty">
                            <span>⌕</span>
                            <h3>Chưa tìm thấy mã nguồn phù hợp</h3>
                            <p>Thử đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm sản phẩm.</p>
                            <button onClick={handleResetAll}>Xóa bộ lọc</button>
                        </div>
                    )}

                    {listStatus === 'succeeded' && list.length > 0 && (
                        <div className="catalog-grid">
                            {list.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <nav className="pagination" aria-label="Phân trang">
                            <button className="pagination__button" disabled={page <= 1} onClick={() => update('page', String(page - 1))}>
                                ←
                            </button>
                            {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((number) => (
                                <button key={number} className="pagination__button" aria-current={number === page ? 'page' : undefined} onClick={() => update('page', String(number))}>
                                    {number}
                                </button>
                            ))}
                            <button className="pagination__button" disabled={page >= pagination.totalPages} onClick={() => update('page', String(page + 1))}>
                                →
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </main>
    )
}

export default ProductsPage