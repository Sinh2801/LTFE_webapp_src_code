import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function MainLayout() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (!hash) window.scrollTo(0, 0);
        }, [pathname, hash]);

    return (
        <>
            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    );
}
export default MainLayout;