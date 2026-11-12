import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { clearAuthError, loginUser } from '../app/slices/authSlice'
import { normalizeEmail, validateEmail, validateLoginPassword } from '../libs/validation'

const DEMO_EMAIL = 'demo@sourcecode.vn'
const DEMO_PASSWORD = 'Demo@1234'

function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user, status, error } = useAppSelector((state) => state.auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [touched, setTouched] = useState({ email: false, password: false })

    const from = (location.state as { from?: string } | null)?.from ?? '/'
    const emailError = validateEmail(email)
    const passwordError = validateLoginPassword(password)
    const canSubmit = !emailError && !passwordError && status !== 'loading'

    useEffect(() => {
        document.title = 'Đăng nhập | SourceCodeTST'
        dispatch(clearAuthError())
    }, [dispatch])

    if (user) return <Navigate to={from} replace />

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setTouched({ email: true, password: true })
        if (!canSubmit) return
        const result = await dispatch(loginUser({ email: normalizeEmail(email), password }))
        if (loginUser.fulfilled.match(result)) navigate(from, { replace: true })
    }

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit} noValidate>
                <h1>Đăng nhập</h1>

                <label>
                    Email (tên tài khoản)
                    <input
                        type="email"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    />
                    {touched.email && emailError && <span className="error-text">{emailError}</span>}
                </label>

                <label>
                    Mật khẩu
                    <input
                        type="password"
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    />
                    {touched.password && passwordError && <span className="error-text">{passwordError}</span>}
                </label>

                {error && <p className="error-text" role="alert">{error}</p>}

                <button type="submit" className="btn btn-primary btn-block" disabled={!canSubmit}>
                    {status === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                        setEmail(DEMO_EMAIL)
                        setPassword(DEMO_PASSWORD)
                    }}
                >
                    Điền tài khoản demo
                </button>

                <p className="muted">
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                </p>
            </form>
        </div>
    )
}

export default LoginPage