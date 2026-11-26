import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { clearAuthError, loginUser } from '../app/slices/authSlice'
import AuthShell from '../components/auth/AuthShell'
import { MailIcon } from '../components/auth/Icons'
import PasswordField from '../components/auth/PasswordField'
import SocialButtons from '../components/auth/SocialButtons'
import TextField from '../components/auth/TextField'
import { useCountdown } from '../hooks/useCountdown'
import { normalizeEmail, validateEmail, validateLoginPassword } from '../libs/validation'

const DEMO = { email: 'demo@sourcecode.vn', password: '12345678' }

interface LoginLocationState {
    from?: string
    email?: string
    notice?: string
}

function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const state = (location.state as LoginLocationState | null) ?? {}
    const { user, status, error } = useAppSelector((s) => s.auth)
    const [email, setEmail] = useState(state.email ?? '')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [emailBlurred, setEmailBlurred] = useState(false)
    const [sessionExpired] = useState(() => {
        try {
            return sessionStorage.getItem('auth:expired') === '1'
        } catch {
            return false
        }
    })
    const lock = useCountdown(0)

    const from = state.from
    const emailError = validateEmail(email)
    const passwordError = validateLoginPassword(password)
    const locked = lock.remaining > 0
    const busy = status === 'loading'

    useEffect(() => {
        document.title = 'Đăng nhập | SourceCodeTST'
        dispatch(clearAuthError())
        try {
            sessionStorage.removeItem('auth:expired')
        } catch {
        }
    }, [dispatch])

    if (user) return <Navigate to={from ?? '/'} replace />

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitted(true)
        if (emailError || passwordError || busy || locked) return
        const result = await dispatch(loginUser({ email: normalizeEmail(email), password, remember }))
        if (loginUser.fulfilled.match(result)) {
            navigate(from ?? '/', { replace: true })
        } else if (result.payload?.retryAfter) {
            lock.start(result.payload.retryAfter)
            setPassword('')
        }
    }

    return (
        <AuthShell
            title="Chào mừng trở lại"
            text="Đăng nhập ngay!"
            items={['Mua một lần, tải lại không giới hạn', 'Bảo hành 30 ngày cho mỗi mã nguồn','Chính sách ưu đãi hấp dẫn']}
        >
            <form className="auth-card" onSubmit={submit} noValidate>
                <header className="auth-card__head">
                    <h1>Đăng nhập</h1>
                    <p>Chưa có tài khoản? <Link to="/register" state={{ from }}>Đăng ký miễn phí</Link></p>
                </header>

                {sessionExpired && <p className="auth-info" role="status">Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.</p>}
                {state.notice && <p className="auth-success" role="status">{state.notice}</p>}
                {from && !sessionExpired && !state.notice && <p className="auth-info" role="status">Bạn cần đăng nhập để tiếp tục.</p>}

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    icon={<MailIcon />}
                    placeholder="ten@email.com"
                    autoComplete="email"
                    maxLength={100}
                    error={submitted || emailBlurred ? emailError : null}
                    onBlur={() => setEmailBlurred(true)}
                />

                <PasswordField
                    label="Mật khẩu"
                    value={password}
                    onChange={setPassword}
                    autoComplete="current-password"
                    error={submitted ? passwordError : null}
                />

                <div className="auth-row">
                    <label className="auth-check">
                        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                        <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <Link className="auth-link" to="/forgot-password" state={{ email: emailError ? '' : email }}>Quên mật khẩu?</Link>
                </div>
                {!remember && <p className="auth-hint">Phiên đăng nhập sẽ kết thúc khi bạn đóng tab này. Nên chọn khi dùng máy tính chung.</p>}

                {error && <p className="auth-alert" role="alert">{error}</p>}
                {locked && <p className="auth-lock" role="status">Tạm khóa đăng nhập, thử lại sau <strong>{lock.remaining}</strong> giây.</p>}

                <button type="submit" className="auth-submit" disabled={busy || locked}>
                    {busy ? 'Đang đăng nhập...' : locked ? `Thử lại sau ${lock.remaining}s` : 'Đăng nhập'}
                </button>

                <SocialButtons mode="login" from={from} disabled={busy} />

                <div className="auth-demo">
                    <span>Dùng thử nhanh:</span>
                    <button type="button" onClick={() => { setEmail(DEMO.email); setPassword(DEMO.password); setSubmitted(false); setEmailBlurred(false) }}>Điền tài khoản demo</button>
                </div>
            </form>
        </AuthShell>
    )
}

export default LoginPage
