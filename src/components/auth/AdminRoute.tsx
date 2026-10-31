import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function AdminRoute() {
    const { isAuthenticated, user } = useAuth()

    // Chưa đăng nhập thì chuyển đến trang đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Đã đăng nhập nhưng không phải Admin
    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    // Nếu là Admin thì được phép truy cập
    return <Outlet />
}

export default AdminRoute