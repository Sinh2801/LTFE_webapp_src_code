import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import AdminRoute from '../components/auth/AdminRoute'

import HomePage from '../pages/HomePage'
import ProductsPage from '../pages/ProductsPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/products',
        element: <ProductsPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
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
        element: <AdminRoute />,
        children: [
            {
                path: '/admin',
                element: <div>Trang quản trị - Chỉ dành cho Admin</div>,
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
])

export default router