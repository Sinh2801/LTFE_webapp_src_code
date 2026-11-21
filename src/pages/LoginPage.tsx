import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { clearAuthError, loginUser } from '../app/slices/authSlice'
import { normalizeEmail, validateEmail, validateLoginPassword } from '../libs/validation'

const DEMOS = [
    { label: 'Người mua', email: 'demo@sourcecode.vn' },
]
const DEMO_PASSWORD = '12345678'

function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user, status, error } = useAppSelector((state) => state.auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [touched, setTouched] = useState(false)

    const from = (location.state as { from?: string } | null)?.from
    const emailError = validateEmail(email)
    const canSubmit = !emailError && !validateLoginPassword(password) && status !== 'loading'

    useEffect(() => {
        document.title = 'Đăng nhập | SourceCodeTST'
        dispatch(clearAuthError())
    }, [dispatch])

    if (user) return <Navigate to={from ?? '/'} replace />

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setTouched(true)
        if (!canSubmit) return
        const result = await dispatch(loginUser({ email: normalizeEmail(email), password }))
        if (loginUser.fulfilled.match(result)) {
            navigate(from ?? '/', { replace: true })
        }
    }

    return (
        <div className="auth-page">
            <aside className="auth-aside">
                <h2>Chào mừng trở lại</h2>
                <p>Đăng nhập để theo dõi đơn hàng và truy cập lại mã nguồn bạn đã mua.</p>
                <ul>
                    <li>✓ Theo dõi trạng thái đơn hàng</li>
                    <li>✓ Truy cập mã nguồn đã mua</li>
                    <li>✓ Quản lý thông tin tài khoản</li>
                </ul>
            </aside>

            <form className="auth-card" onSubmit={submit} noValidate>
                <Link to="/" className="auth-back">
                    <span className="auth-back__icon" aria-hidden="true">←</span>
                    Quay lại trang chủ
                </Link>
                <h1>Đăng nhập</h1>
                <label className="auth-field">
                    <span>Email (tên tài khoản)</span>
                    <input type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
                    {touched && emailError && <span className="error-text">{emailError}</span>}
                </label>
                <label className="auth-field">
                    <span>Mật khẩu</span>
                    <input type="password" value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
                </label>
                {error && <p className="auth-alert" role="alert">{error}</p>}
                <button type="submit" className="auth-submit" disabled={!canSubmit}>
                    {status === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
                <div className="auth-demo">
                    <span>Tài khoản thử:</span>
                    {DEMOS.map((d) => (
                        <button key={d.email} type="button" onClick={() => { setEmail(d.email); setPassword(DEMO_PASSWORD); setTouched(false) }}>
                            {d.label}
                        </button>
                    ))}
                </div>
                <p className="auth-foot">Chưa có tài khoản? <Link to="/register">Đăng ký miễn phí</Link></p>
            </form>
        </div>
    )
}

export default LoginPage
