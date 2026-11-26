import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { clearAuthError, registerUser } from '../app/slices/authSlice'
import AuthShell from '../components/auth/AuthShell'
import { MailIcon, UserIcon } from '../components/auth/Icons'
import PasswordField from '../components/auth/PasswordField'
import PasswordStrength from '../components/auth/PasswordStrength'
import SocialButtons from '../components/auth/SocialButtons'
import TextField from '../components/auth/TextField'
import { useToast } from '../components/common/Toast'
import { authService } from '../libs/services'
import { normalizeEmail, normalizeFullName, passwordResults, validateEmail, validateFullName, validatePassword } from '../libs/validation'

type EmailState = 'idle' | 'checking' | 'ok' | 'taken' | 'error'

function RegisterPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { showToast } = useToast()
    const { user, status, error } = useAppSelector((state) => state.auth)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [agree, setAgree] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [emailState, setEmailState] = useState<EmailState>('idle')

    const from = (location.state as { from?: string } | null)?.from
    const nameError = validateFullName(fullName)
    const emailError = validateEmail(email)
    const passError = validatePassword(password)
    const confirmError = !confirm ? 'Vui lòng nhập lại mật khẩu' : confirm !== password ? 'Mật khẩu nhập lại không khớp' : null
    const termsError = agree ? null : 'Bạn cần đồng ý với điều khoản và chính sách để tiếp tục'
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

    if (user) return <Navigate to={from ?? '/'} replace />

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitted(true)
        if (nameError || emailError || emailState === 'taken' || passError || confirmError || !agree || status === 'loading') return
        const result = await dispatch(registerUser({ fullName: normalizeFullName(fullName), email: normalizeEmail(email), password }))
        if (registerUser.fulfilled.match(result)) {
            showToast('Tạo tài khoản thành công, chào mừng bạn!', 'success')
            navigate(from ?? '/', { replace: true })
        }
    }

    const show = (msg: string | null) => (submitted && msg ? msg : null)

    return (
        <AuthShell
            title="Tạo tài khoản mua hàng"
            text="Một tài khoản để mua mã nguồn, tải lại bất cứ lúc nào và nhận hỗ trợ bảo hành."
            items={['Theo dõi đơn hàng dễ dàng', 'Tải lại mã nguồn đã mua không giới hạn', 'Đăng ký nhanh bằng Google hoặc Facebook']}
        >
            <form className="auth-card" onSubmit={submit} noValidate>
                <header className="auth-card__head">
                    <h1>Tạo tài khoản</h1>
                    <p>Đã có tài khoản? <Link to="/login" state={{ from }}>Đăng nhập</Link></p>
                </header>
                <TextField label="Họ và tên" value={fullName} onChange={setFullName} icon={<UserIcon />} placeholder="Nguyễn Văn A" maxLength={60} autoComplete="name" error={show(nameError)} />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    icon={<MailIcon />}
                    placeholder="ten@email.com"
                    maxLength={100}
                    autoComplete="email"
                    error={show(emailError)}
                    hint={
                        show(emailError) ? null
                            : emailState === 'checking' ? <span className="muted">Đang kiểm tra email...</span>
                                : emailState === 'ok' ? <span className="ok-text">✓ Email có thể sử dụng</span>
                                    : emailState === 'taken' ? <span className="error-text">Email này đã được sử dụng. <Link to="/login" state={{ email, from }}>Đăng nhập</Link> hoặc <Link to="/forgot-password" state={{ email }}>lấy lại mật khẩu</Link></span>
                                        : emailState === 'error' ? <span className="error-text">Không kiểm tra được email</span> : null
                    }
                />
                <PasswordField
                    label="Mật khẩu"
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                    hint={<PasswordStrength password={password} />}
                />
                <ul className="auth-rules">
                    {rules.map((r) => <li key={r.id} className={r.ok ? 'rule-ok' : password ? 'rule-bad' : ''}>{r.ok ? '✓' : password ? '✕' : '•'} {r.label}</li>)}
                </ul>
                <PasswordField label="Nhập lại mật khẩu" value={confirm} onChange={setConfirm} autoComplete="new-password" error={show(confirmError)} />

                <label className="auth-check auth-check--terms">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                    <span>Tôi đồng ý với <Link to="/chinh-sach" target="_blank">điều khoản, giấy phép và chính sách hoàn tiền</Link> của SourceCodeTST</span>
                </label>
                {show(termsError) && <span className="error-text">{termsError}</span>}

                {error && <p className="auth-alert" role="alert">{error}</p>}
                <button type="submit" className="auth-submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                </button>

                <SocialButtons mode="register" from={from} disabled={status === 'loading'} />
            </form>
        </AuthShell>
    )
}

export default RegisterPage
