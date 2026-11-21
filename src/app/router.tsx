import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

import HomePage from '../pages/HomePage';
import CartPage from '../pages/cart/CartPage.tsx';
import ProductsPage from '../pages/ProductsPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import CheckoutPage from '../pages/checkout/CheckoutPage.tsx'
import RegisterPage from "../pages/RegisterPage.tsx";
import ProfilePage from '../pages/ProfilePage';
import ProductDetailPage from '../pages/ProductDetailPage';
import FavoritesPage from '../pages/FavoritesPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import PolicyPage from '../pages/PolicyPage';

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
                path: '/products/:id',
                element: <ProductDetailPage />,
            },
            {
                path: '/favorites',
                element: <FavoritesPage />,
            },
            {
                path: '/chinh-sach',
                element: <PolicyPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/checkout',
                        element: <CheckoutPage />,
                    },
                    {
                        path: '/orders/:id',
                        element: <OrderDetailPage />,
                    },
                    {
                        path: '/profile',
                        element: <ProfilePage />,
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
    {
        path: '/register',
        element: <RegisterPage />
    },
]);

export default router;
