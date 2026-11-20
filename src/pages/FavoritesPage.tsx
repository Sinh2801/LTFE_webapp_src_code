import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hook'
import ProductCard from '../components/common/ProductCard'

function FavoritesPage() {
    const favorites = useAppSelector((state) => state.favorites.items)
    return <main className="catalog-page favorites-page">
        <div className="catalog-intro"><span className="home-section__eyebrow">ĐÃ LƯU</span><h1>Sản phẩm yêu thích</h1><p>Lưu lại những mã nguồn bạn muốn xem hoặc mua sau.</p></div>
        {favorites.length ? <><div className="catalog-results-heading"><h2>Danh sách đã lưu</h2><span>{favorites.length} sản phẩm</span></div><div className="catalog-grid">{favorites.map((product) => <ProductCard key={product.id} product={product} />)}</div></> : <div className="catalog-empty"><span>♡</span><h3>Chưa có sản phẩm yêu thích</h3><p>Nhấn biểu tượng trái tim trên sản phẩm để lưu vào danh sách này.</p><Link to="/products">Khám phá mã nguồn</Link></div>}
    </main>
}

export default FavoritesPage
