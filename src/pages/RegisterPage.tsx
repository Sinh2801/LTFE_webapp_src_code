import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { clearAuthError, registerUser } from '../app/slices/authSlice'
import { authService } from '../libs/services'
import { normalizeEmail, normalizeFullName, passwordResults, validateEmail, validateFullName, validatePassword } from '../libs/validation'

type EmailState = 'idle' | 'checking' | 'ok' | 'taken' | 'error'

function RegisterPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { user, status, error } = useAppSelector((state) => state.auth)
    const [role, setRole] = useState<'buyer' | 'seller'>(params.get('role') === 'seller' ? 'seller' : 'buyer')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [emailState, setEmailState] = useState<EmailState>('idle')

    const nameError = validateFullName(fullName)
    const emailError = validateEmail(email)
    const passError = validatePassword(password)
    const confirmError = !confirm ? 'Vui lòng nhập lại mật khẩu' : confirm !== password ? 'Mật khẩu nhập lại không khớp' : null
    const canSubmit = !nameError && !emailError && emailState === 'ok' && !passError && !confirmError && status !== 'loading'
    const rules = passwordResults(password)

    useEffect(() => {
        document.title = 'Đăng ký | SourceCodeTST'
        dispatch(clearAuthError())
    }, [dispatch])

    useEffect(() => {
        if (emailError) { setEmailState('idle'); return }
        setEmailState('checking')
        let cancelled = false
        const timer = window.setTimeout(async () => {
            try {
                const data = await authService.checkEmail(normalizeEmail(email))
                if (!cancelled) setEmailState(data.available ? 'ok' : 'taken')
            } catch {
                if (!cancelled) setEmailState('error')
            }
        }, 400)
        return () => { cancelled = true; window.clearTimeout(timer) }
    }, [email, emailError])

    if (user) return <Navigate to={user.role === 'seller' ? '/seller' : '/'} replace />

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitted(true)
        if (!canSubmit) return
        const result = await dispatch(registerUser({ fullName: normalizeFullName(fullName), email: normalizeEmail(email), password, role }))
        if (registerUser.fulfilled.match(result)) navigate(role === 'seller' ? '/seller' : '/', { replace: true })
    }

    const show = (msg: string | null) => (submitted && msg ? msg : null)

    return (
        <div className="auth-page">
            <aside className="auth-aside">
                <h2>{role === 'seller' ? 'Bắt đầu bán mã nguồn' : 'Tạo tài khoản mua hàng'}</h2>
                <p>{role === 'seller'
                    ? 'Đăng sản phẩm trong vài phút, theo dõi doanh thu và đánh giá trong kênh người bán.'
                    : 'Mua mã nguồn chất lượng, tải về bất cứ lúc nào và xem lại lịch sử đơn hàng.'}</p>
                <div className="auth-switch" role="radiogroup" aria-label="Vai trò">
                    <button type="button" role="radio" aria-checked={role === 'buyer'} className={role === 'buyer' ? 'is-on' : ''} onClick={() => setRole('buyer')}>Người Mua</button>
                    <button type="button" role="radio" aria-checked={role === 'seller'} className={role === 'seller' ? 'is-on' : ''} onClick={() => setRole('seller')}> Người Bán</button>
                </div>
            </aside>

            <form className="auth-card" onSubmit={submit} noValidate>
                <h1>Đăng ký</h1>
                <label className="auth-field">
                    <span>Họ và tên</span>
                    <input type="text" value={fullName} maxLength={60} autoComplete="name" onChange={(e) => setFullName(e.target.value)} />
                    {show(nameError) && <span className="error-text">{nameError}</span>}
                </label>
                <label className="auth-field">
                    <span>Email (tên tài khoản)</span>
                    <input type="email" value={email} maxLength={100} autoComplete="email" onChange={(e) => setEmail(e.target.value)} />
                    {show(emailError) ? <span className="error-text">{emailError}</span>
                        : emailState === 'checking' ? <span className="muted">Đang kiểm tra email...</span>
                            : emailState === 'ok' ? <span className="ok-text">✓ Email có thể sử dụng</span>
                                : emailState === 'taken' ? <span className="error-text">Email này đã được sử dụng</span>
                                    : emailState === 'error' ? <span className="error-text">Không kiểm tra được email</span> : null}
                </label>
                <label className="auth-field">
                    <span>Mật khẩu</span>
                    <input type="password" value={password} maxLength={64} autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} />
                </label>
                <ul className="auth-rules">
                    {rules.map((r) => <li key={r.id} className={r.ok ? 'rule-ok' : password ? 'rule-bad' : ''}>{r.ok ? '✓' : password ? '✕' : '•'} {r.label}</li>)}
                </ul>
                <label className="auth-field">
                    <span>Nhập lại mật khẩu</span>
                    <input type="password" value={confirm} maxLength={64} autoComplete="new-password" onChange={(e) => setConfirm(e.target.value)} />
                    {show(confirmError) && <span className="error-text">{confirmError}</span>}
                </label>
                {error && <p className="auth-alert" role="alert">{error}</p>}
                <button type="submit" className="auth-submit" disabled={!canSubmit}>
                    {status === 'loading' ? 'Đang tạo tài khoản...' : role === 'seller' ? 'Đăng ký làm người bán' : 'Đăng ký'}
                </button>
                <p className="auth-foot">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
            </form>
        </div>
    )
}

export default RegisterPage
