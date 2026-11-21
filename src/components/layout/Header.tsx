import { useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { signOut } from '../../app/slices/authSlice'
import sourceCodeLogo from '../../assets/sourcecode-logo.png'
import { preferences, usePreferences } from '../../hooks/usePreferences'

function LanguageFlag({ language }: { language: 'vi' | 'en' }) {
    if (language === 'vi') {
        return (
            <svg className="language-flag" viewBox="0 0 18 12" aria-hidden="true">
                <rect width="18" height="12" fill="#da251d" />
                <path d="m9 2 .9 2.8h3l-2.4 1.7.9 2.8L9 7.6l-2.4 1.7.9-2.8L5.1 4.8h3z" fill="#ff0" />
            </svg>
        )
    }

    return (
        <svg className="language-flag" viewBox="0 0 18 12" aria-hidden="true">
            <rect width="18" height="12" fill="#012169" />
            <path d="m0 0 18 12M18 0 0 12" stroke="#fff" strokeWidth="3" />
            <path d="m0 0 18 12M18 0 0 12" stroke="#c8102e" strokeWidth="1.2" />
            <path d="M9 0v12M0 6h18" stroke="#fff" strokeWidth="4" />
            <path d="M9 0v12M0 6h18" stroke="#c8102e" strokeWidth="2" />
        </svg>
    )
}

function Header() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useAppSelector((state) => state.auth.user)
    const cartCount = useAppSelector((state) => state.cart.items.length)
    const { language, theme } = usePreferences()
    const [languageOpen, setLanguageOpen] = useState(false)
    const darkMode = theme === 'dark'

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
                    <img className="brand-logo" src={sourceCodeLogo} alt="" />
                    <span>SourceCode<span className="brand-accent">TST</span></span>
                </Link>

                <nav className="main-nav">
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Trang chủ</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : undefined}>Sản phẩm</NavLink>
                    <NavLink to="/chinh-sach" className={({ isActive }) => isActive ? 'active' : undefined}>Chính sách</NavLink>
                    <a href="/#gioi-thieu">Giới thiệu</a>
                    <a href="/#lien-he">Liên hệ</a>
                </nav>

                <form className="header-search-wrap" onSubmit={handleSearch}>
                    <input
                        key={`${location.pathname}${location.search}`}
                        className="header-search"
                        type="search"
                        name="q"
                        aria-label="Tìm kiếm mã nguồn"
                        placeholder="Tìm kiếm"
                        defaultValue={location.pathname === '/products' ? new URLSearchParams(location.search).get('q') ?? '' : ''}
                    />
                    <button className="header-search-submit" type="submit" aria-label="Tìm kiếm">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="10.8" cy="10.8" r="6.5" />
                            <path d="m16 16 4.5 4.5" />
                        </svg>
                    </button>
                </form>

                <div className="header-actions">
                    <Link to="/favorites" className="favorite-button" aria-label="Sản phẩm yêu thích">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
                        </svg>
                    </Link>
                    <Link to="/cart" className="cart-button">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" />
                            <circle cx="10" cy="20" r="1.2" />
                            <circle cx="18" cy="20" r="1.2" />
                        </svg>
                        <span className="cart-count">{cartCount}</span>
                    </Link>
                    {user ? (
                        <>
                            <Link to="/profile" className="profile-button" aria-label={`Hồ sơ ${user.fullName}`}>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="8" r="3.5" />
                                    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                                </svg>
                            </Link>
                            <button type="button" className="btn-register" onClick={handleSignOut}>Đăng xuất</button>
                        </>
                    ) : (
                        <Link to="/login" className="profile-button" aria-label="Đăng nhập">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="8" r="3.5" />
                                <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                            </svg>
                        </Link>
                    )}
                    <div className="language-picker">
                        <button
                            type="button"
                            className="language-trigger"
                            aria-label="Chọn ngôn ngữ"
                            aria-haspopup="menu"
                            aria-expanded={languageOpen}
                            onClick={() => setLanguageOpen((open) => !open)}
                        >
                            <LanguageFlag language={language} />
                            <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2 4 4 4 4-4" /></svg>
                        </button>
                        {languageOpen && (
                            <div className="language-menu" role="menu">
                                <button type="button" role="menuitemradio" aria-checked={language === 'vi'} onClick={() => { preferences.setLanguage('vi'); setLanguageOpen(false) }}>
                                    <LanguageFlag language="vi" /> Tiếng Việt
                                </button>
                                <button type="button" role="menuitemradio" aria-checked={language === 'en'} onClick={() => { preferences.setLanguage('en'); setLanguageOpen(false) }}>
                                    <LanguageFlag language="en" /> English
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        className="theme-toggle"
                        aria-label={darkMode ? 'Bật giao diện sáng' : 'Bật giao diện tối'}
                        title={darkMode ? 'Giao diện sáng' : 'Giao diện tối'}
                        onClick={() => preferences.setTheme(darkMode ? 'light' : 'dark')}
                    >
                        {darkMode ? (
                            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.6 8.6 0 1 0 20.5 15.2Z" /></svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
