import { useAppSelector } from '../../app/hook'
import ReviewSection from '../review/ReviewSection'
import InstallGuide from './InstallGuide'
import WarrantyPolicy from './WarrantyPolicy'
import type { DetailTab } from './BuyBox'
import { formatDate } from '../../libs/format'
import type { Product } from '../../libs/types'

interface ProductTabsProps {
    product: Product
    tab: DetailTab
    onChange: (tab: DetailTab) => void
}

function ProductTabs({ product, tab, onChange }: ProductTabsProps) {
    const reviewCount = useAppSelector((state) => state.reviews.productId === product.id && state.reviews.summary ? state.reviews.summary.count : product.reviewCount ?? 0)
    const tabs: { id: DetailTab; label: string }[] = [
        { id: 'mo-ta', label: 'Mô tả & tính năng' },
        { id: 'cai-dat', label: 'Hướng dẫn cài đặt' },
        { id: 'bao-hanh', label: 'Bảo hành & hỗ trợ' },
        { id: 'danh-gia', label: `Đánh giá (${reviewCount})` },
    ]

    return (
        <section className="detail-tabs">
            <div className="detail-tabs__list" role="tablist" aria-label="Thông tin sản phẩm">
                {tabs.map((item) => (
                    <button key={item.id} type="button" role="tab" id={`tab-${item.id}`} aria-selected={tab === item.id} aria-controls={`panel-${item.id}`} className={tab === item.id ? 'is-on' : ''} onClick={() => onChange(item.id)}>
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="detail-tabs__panel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
                {tab === 'mo-ta' && (
                    <div className="detail-about">
                        <div>
                            <h2>Mô tả sản phẩm</h2>
                            <p>{product.description}</p>
                            <h3>Tính năng nổi bật</h3>
                            <ul className="check-list">{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                        </div>
                        <aside className="detail-facts">
                            <h3>Thông tin sản phẩm</h3>
                            <dl>
                                <div><dt>Mã sản phẩm</dt><dd>{product.code}</dd></div>
                                <div><dt>Danh mục</dt><dd>{product.category}</dd></div>
                                <div><dt>Phiên bản</dt><dd>{product.version}</dd></div>
                                <div><dt>Giấy phép</dt><dd>{product.license}</dd></div>
                                <div><dt>Ngày đăng</dt><dd>{formatDate(product.createdAt)}</dd></div>
                                <div><dt>Công nghệ</dt><dd>{product.technologies.join(', ')}</dd></div>
                            </dl>
                        </aside>
                    </div>
                )}
                {tab === 'cai-dat' && (
                    <>
                        <h2>Hướng dẫn cài đặt</h2>
                        <InstallGuide product={product} />
                    </>
                )}
                {tab === 'bao-hanh' && (
                    <>
                        <h2>Chính sách bảo hành &amp; hỗ trợ</h2>
                        <WarrantyPolicy />
                    </>
                )}
                {tab === 'danh-gia' && <ReviewSection product={product} />}
            </div>
        </section>
    )
}

export default ProductTabs
