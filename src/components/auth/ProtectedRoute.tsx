import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hook'

function ProtectedRoute({ role }: { role?: 'buyer' | 'seller' }) {
    const { user, initialized } = useAppSelector((s) => s.auth)
    const location = useLocation()

    if (!initialized) return <div className="loading" role="status">Đang kiểm tra đăng nhập...</div>
    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
    if (role && user.role !== role) return <Navigate to="/" replace />
    return <Outlet />
}

export default ProtectedRoute