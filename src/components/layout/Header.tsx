import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="site-header">
            <div className="header-container">
                <Link to="/" className="brand">
                    SourceCodeTST
                </Link>

                <input
                    className="header-search"
                    type="text"
                    placeholder="Tìm kiếm mã nguồn..."
                />

                <nav className="main-nav">
                    <Link to="/">Trang chủ</Link>
                    <Link to="/products">Sản phẩm</Link>
                </nav>

                <div className="header-actions">
                    <Link to="/login" className="btn-login">
                        Đăng nhập
                    </Link>
                    <Link to="/login" className="btn-register">
                        Đăng ký
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;