import { useMemo, useState } from 'react'

export interface CategoryOption {
    id: string
    name: string
    slug: string
}

export interface ProductFilterValues {
    category: string
    tech: string
    minPrice: string
    maxPrice: string
    rating: string
    onSale: boolean
}

interface ProductFilterSidebarProps {
    categories: CategoryOption[]
    filters: ProductFilterValues
    onChange: (updates: Partial<ProductFilterValues>) => void
    onReset: () => void
    isOpenMobile: boolean
    onCloseMobile: () => void
}

const POPULAR_TECHNOLOGIES = [
    'React',
    'Next.js',
    'TypeScript',
    'Vue',
    'Node.js',
    'Laravel',
    'PHP',
    'Python',
    'Java',
    'Flutter',
    'Tailwind',
    'MySQL',
    'MongoDB',
    'PostgreSQL',
    'Firebase',
    'Docker',
]

const PRICE_PRESETS = [
    { label: 'Tất cả mức giá', min: '', max: '' },
    { label: 'Miễn phí', min: '0', max: '0' },
    { label: 'Dưới 500.000đ', min: '', max: '500000' },
    { label: '500.000đ - 1.000.000đ', min: '500000', max: '1000000' },
    { label: '1.000.000đ - 3.000.000đ', min: '1000000', max: '3000000' },
    { label: 'Trên 3.000.000đ', min: '3000000', max: '' },
]

const RATING_OPTIONS = [5, 4, 3]

function FilterSidebar({categories, filters, onChange, onReset, isOpenMobile, onCloseMobile,}: ProductFilterSidebarProps) {
    const [openSections, setOpenSections] = useState({
        category: true,
        tech: true,
        price: true,
        rating: true,
        promo: true,
    })
    const [techSearch, setTechSearch] = useState('')
    const [minInput, setMinInput] = useState(filters.minPrice)
    const [maxInput, setMaxInput] = useState(filters.maxPrice)

    const hasActiveFilters = Boolean(
        filters.category ||
        filters.tech ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.rating ||
        filters.onSale
    )

    const filteredTechnologies = useMemo(() => {
        const keyword = techSearch.trim().toLowerCase()
        if (!keyword) return POPULAR_TECHNOLOGIES
        return POPULAR_TECHNOLOGIES.filter((item) => item.toLowerCase().includes(keyword))
    }, [techSearch])

    const toggleSection = (key: keyof typeof openSections) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSelectPresetPrice = (min: string, max: string) => {
        setMinInput(min)
        setMaxInput(max)
        onChange({ minPrice: min, maxPrice: max })
    }

    const handleApplyCustomPrice = (event: React.FormEvent) => {
        event.preventDefault()
        onChange({
            minPrice: minInput.trim(),
            maxPrice: maxInput.trim(),
        })
    }

    const handleResetAll = () => {
        setTechSearch('')
        setMinInput('')
        setMaxInput('')
        onReset()
    }

    return (
        <>
            {isOpenMobile && (<div className="filter-backdrop" onClick={onCloseMobile} aria-hidden="true"/>)}

            <aside className={`filter-sidebar ${isOpenMobile ? 'is-open' : ''}`} aria-label="Bộ lọc tìm kiếm">
                <div className="filter-sidebar__header">
                    <div className="filter-sidebar__title">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
                        </svg>
                        <span>Bộ lọc tìm kiếm</span>
                    </div>

                    <div className="filter-sidebar__header-actions">
                        {hasActiveFilters && (
                            <button type="button" className="filter-sidebar__reset" onClick={handleResetAll}>
                                Xóa lọc
                            </button>)}
                        <button type="button" className="filter-sidebar__close" onClick={onCloseMobile} aria-label="Đóng bộ lọc">
                            ✕
                        </button>
                    </div>
                </div>

                {/* 1. Danh mục */}
                <section className="filter-group">
                    <button
                        type="button"
                        className="filter-group__trigger"
                        aria-expanded={openSections.category}
                        onClick={() => toggleSection('category')}>
                        <span>Danh mục</span>
                        <svg className={`filter-group__chevron ${openSections.category ? 'is-open' : ''}`} viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5 7.5L10 12.5L15 7.5" />
                        </svg>
                    </button>

                    {openSections.category && (
                        <div className="filter-group__body filter-radio-list">
                            <label className={`filter-radio-item ${filters.category === '' ? 'is-active' : ''}`}>
                                <input type="radio" name="catalog-category" checked={filters.category === ''} onChange={() => onChange({ category: '' })}/>
                                <span>Tất cả lĩnh vực</span>
                            </label>

                            {categories.map((item) => {
                                const isActive = filters.category === item.slug || filters.category === item.id
                                return (<label key={item.id} className={`filter-radio-item ${isActive ? 'is-active' : ''}`}>
                                        <input type="radio" name="catalog-category" checked={isActive} onChange={() => onChange({ category: item.slug })}/>
                                        <span>{item.name}</span>
                                    </label>)
                            })}
                        </div>)}
                </section>

                {/* 2. Công nghệ */}
                <section className="filter-group">
                    <button type="button" className="filter-group__trigger" aria-expanded={openSections.tech} onClick={() => toggleSection('tech')}>
                        <span>Công nghệ</span>
                        <svg className={`filter-group__chevron ${openSections.tech ? 'is-open' : ''}`} viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5 7.5L10 12.5L15 7.5" />
                        </svg>
                    </button>

                    {openSections.tech && (
                        <div className="filter-group__body">
                            <div className="filter-tech-search">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="M20 20l-3.5-3.5" />
                                </svg>
                                <input type="text" value={techSearch} onChange={(e) => setTechSearch(e.target.value)} onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            onChange({ tech: techSearch.trim() })
                                        }}}
                                       placeholder="Tìm công nghệ..."
                                />
                            </div>

                            <div className="filter-tech-tags">
                                {filteredTechnologies.map((tech) => {
                                    const isActive = filters.tech.toLowerCase() === tech.toLowerCase()
                                    return (
                                        <button key={tech} type="button" className={`filter-tech-tag ${isActive ? 'is-active' : ''}`} onClick={() => onChange({ tech: isActive ? '' : tech })}>{tech}
                                        </button>)
                                })}
                                {filteredTechnologies.length === 0 && techSearch.trim() && (
                                    <button type="button" className="filter-tech-tag is-active" onClick={() => onChange({ tech: techSearch.trim() })}>
                                        Lọc theo “{techSearch.trim()}”
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* 3. Khoảng giá */}
                <section className="filter-group">
                    <button type="button" className="filter-group__trigger" aria-expanded={openSections.price} onClick={() => toggleSection('price')}>
                        <span>Khoảng giá</span>
                        <svg className={`filter-group__chevron ${openSections.price ? 'is-open' : ''}`} viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5 7.5L10 12.5L15 7.5" />
                        </svg>
                    </button>

                    {openSections.price && (
                        <div className="filter-group__body">
                            <div className="filter-radio-list">
                                {PRICE_PRESETS.map((preset) => {
                                    const isActive =
                                        filters.minPrice === preset.min &&
                                        filters.maxPrice === preset.max
                                    return (
                                        <label key={preset.label} className={`filter-radio-item ${isActive ? 'is-active' : ''}`}>
                                            <input type="radio" name="catalog-price" checked={isActive} onChange={() => handleSelectPresetPrice(preset.min, preset.max)}/>
                                            <span>{preset.label}</span>
                                        </label>
                                    )
                                })}
                            </div>

                            <form className="filter-price-custom" onSubmit={handleApplyCustomPrice}>
                                <div className="filter-price-inputs">
                                    <input type="number" min="0" step="50000" value={minInput} onChange={(e) => setMinInput(e.target.value)} placeholder="Từ (đ)" aria-label="Giá tối thiểu"/>
                                    <span>-</span>
                                    <input type="number" min="0" step="50000" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} placeholder="Đến (đ)" aria-label="Giá tối đa"/>
                                </div>
                                <button type="submit" className="filter-price-apply">
                                    Áp dụng
                                </button>
                            </form>
                        </div>
                    )}
                </section>

                {/* 4. Đánh giá */}
                <section className="filter-group">
                    <button type="button" className="filter-group__trigger" aria-expanded={openSections.rating} onClick={() => toggleSection('rating')}
                    >
                        <span>Đánh giá</span>
                        <svg className={`filter-group__chevron ${openSections.rating ? 'is-open' : ''}`} viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5 7.5L10 12.5L15 7.5" />
                        </svg>
                    </button>

                    {openSections.rating && (
                        <div className="filter-group__body filter-rating-list">
                            {RATING_OPTIONS.map((star) => {
                                const isActive = filters.rating === String(star)
                                return (
                                    <button key={star} type="button" className={`filter-rating-item ${isActive ? 'is-active' : ''}`} onClick={() =>
                                            onChange({ rating: isActive ? '' : String(star) })}>
                                        <span className="filter-stars" aria-hidden="true">
                                            {'★'.repeat(star)}
                                            <span className="filter-stars--empty">
                                                {'★'.repeat(5 - star)}
                                            </span>
                                        </span>
                                        <span>{star === 5 ? '5 sao' : `Từ ${star} sao`}</span>
                                    </button>)
                            })}
                        </div>
                    )}
                </section>

                {/* 5. Ưu đãi */}
                <section className="filter-group">
                    <button type="button" className="filter-group__trigger" aria-expanded={openSections.promo} onClick={() => toggleSection('promo')}>
                        <span>Ưu đãi</span>
                        <svg className={`filter-group__chevron ${openSections.promo ? 'is-open' : ''}`} viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M5 7.5L10 12.5L15 7.5" />
                        </svg>
                    </button>

                    {openSections.promo && (
                        <div className="filter-group__body">
                            <label className={`filter-checkbox-item ${filters.onSale ? 'is-active' : ''}`}>
                                <input type="checkbox" checked={filters.onSale} onChange={(e) => onChange({ onSale: e.target.checked })}/>
                                <span>Đang giảm giá</span>
                            </label>
                        </div>
                    )}
                </section>
            </aside>
        </>
    )
}

export default FilterSidebar