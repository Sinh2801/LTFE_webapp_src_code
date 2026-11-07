import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

import HomePage from '../pages/HomePage';
import CartPage from '../pages/cart/CartPage.tsx';
import ProductsPage from '../pages/ProductsPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/products',
                element: <ProductsPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/profile',
                        element: <div>Trang cá nhân - Yêu cầu đăng nhập</div>,
                    },
                ],
            },
            {
                path: '/cart',
                element: <CartPage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
]);

export default router;
