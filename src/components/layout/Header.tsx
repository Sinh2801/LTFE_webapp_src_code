import type { FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { signOut } from '../../app/slices/authSlice'

function Header() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useAppSelector((state) => state.auth.user)
    const cartCount = useAppSelector((state) => state.cart.items.length)
    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const query = String(new FormData(event.currentTarget).get('q') ?? '').trim()
        navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products')
    }

    async function handleSignOut() {
        await dispatch(signOut())
        navigate('/')
    }

    return (
        <header className="site-header">
            <div className="header-container">
                <Link to="/" className="brand">
                    <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
                    <span>SourceCodeTST</span>
                </Link>

                <form className="header-search-wrap" onSubmit={handleSearch}>
                    <span aria-hidden="true">⌕</span>
                    <input
                        key={`${location.pathname}${location.search}`}
                        className="header-search"
                        type="search"
                        name="q"
                        aria-label="Tìm kiếm mã nguồn"
                        placeholder="Tìm kiếm mã nguồn, dự án..."
                        defaultValue={location.pathname === '/products' ? new URLSearchParams(location.search).get('q') ?? '' : ''}
                    />
                </form>

                <nav className="main-nav">
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Trang chủ</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : undefined}>Sản phẩm</NavLink>
                </nav>

                <div className="header-actions">
                    <Link to="/cart" className="cart-button">
                        Giỏ hàng <span className="cart-count">{cartCount}</span>
                    </Link>
                    {user ? (
                        <>
                            <Link to="/profile" className="btn-login">{user.fullName.split(' ').pop()}</Link>
                            <button type="button" className="btn-register" onClick={handleSignOut}>Đăng xuất</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-login">Đăng nhập</Link>
                            <Link to="/register" className="btn-register">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
