import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { clearAuthError, registerUser } from '../app/slices/authSlice'
import { authService } from '../libs/services'
import {
    normalizeEmail,
    normalizeFullName,
    passwordResults,
    validateEmail,
    validateFullName,
    validatePassword,
} from '../libs/validation'

type EmailStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error'
type Field = 'fullName' | 'email' | 'password' | 'confirm'

const EMAIL_CHECK_DELAY_MS = 400

function RegisterPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { user, status, error } = useAppSelector((state) => state.auth)

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [touched, setTouched] = useState<Record<Field, boolean>>({
        fullName: false,
        email: false,
        password: false,
        confirm: false,
    })
    const [submitted, setSubmitted] = useState(false)
    const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle')

    const fullNameError = validateFullName(fullName)
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const confirmError = confirm.length === 0
        ? 'Vui lòng nhập lại mật khẩu'
        : confirm !== password
            ? 'Mật khẩu nhập lại không khớp'
            : null
    const rules = passwordResults(password)

    useEffect(() => {
        document.title = 'Đăng ký | SourceCodeTST'
        dispatch(clearAuthError())
    }, [dispatch])

    //ajax
    useEffect(() => {
        if (emailError) {
            setEmailStatus('idle')
            return
        }
        setEmailStatus('checking')
        let cancelled = false
        const timer = window.setTimeout(async () => {
            try {
                const data = await authService.checkEmail(normalizeEmail(email))
                if (!cancelled) setEmailStatus(data.available ? 'available' : 'taken')
            } catch {
                if (!cancelled) setEmailStatus('error')
            }
        }, EMAIL_CHECK_DELAY_MS)
        return () => {
            cancelled = true
            window.clearTimeout(timer)
        }
    }, [email, emailError])

    if (user) return <Navigate to="/" replace />

    const canSubmit =
        !fullNameError && !emailError && emailStatus === 'available' && !passwordError && !confirmError && status !== 'loading'

    const touch = (field: Field) => setTouched((t) => ({ ...t, [field]: true }))
    const showError = (field: Field, message: string | null) => (touched[field] || submitted) && message

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitted(true)
        if (!canSubmit) return
        const result = await dispatch(
            registerUser({
                fullName: normalizeFullName(fullName),
                email: normalizeEmail(email),
                password,
            }),
        )
        if (registerUser.fulfilled.match(result)) navigate('/', { replace: true })
    }

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit} noValidate>
                <h1>Tạo tài khoản</h1>

                <label>
                    Họ và tên
                    <input
                        type="text"
                        value={fullName}
                        maxLength={60}
                        autoComplete="name"
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => touch('fullName')}
                    />
                    {showError('fullName', fullNameError) && <span className="error-text">{fullNameError}</span>}
                </label>

                <label>
                    Email (tên tài khoản)
                    <input
                        type="email"
                        value={email}
                        maxLength={100}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => touch('email')}
                    />
                    {showError('email', emailError) ? (
                        <span className="error-text">{emailError}</span>
                    ) : emailStatus === 'checking' ? (
                        <span className="muted">Đang kiểm tra email...</span>
                    ) : emailStatus === 'available' ? (
                        <span className="rule-ok">✔ Email có thể sử dụng</span>
                    ) : emailStatus === 'taken' ? (
                        <span className="error-text">Email này đã được sử dụng</span>
                    ) : emailStatus === 'error' ? (
                        <span className="error-text">Không kiểm tra được email, thử lại sau</span>
                    ) : null}
                </label>

                <label>
                    Mật khẩu
                    <input
                        type="password"
                        value={password}
                        maxLength={64}
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => touch('password')}
                    />
                </label>
                <ul className="rule-list" aria-label="Yêu cầu mật khẩu">
                    {rules.map((rule) => (
                        <li key={rule.id} className={rule.ok ? 'rule-ok' : password ? 'rule-bad' : 'muted'}>
                            {rule.ok ? '✔' : password ? '✘' : '•'} {rule.label}
                        </li>
                    ))}
                </ul>

                <label>
                    Nhập lại mật khẩu
                    <input
                        type="password"
                        value={confirm}
                        maxLength={64}
                        autoComplete="new-password"
                        onChange={(e) => setConfirm(e.target.value)}
                        onBlur={() => touch('confirm')}
                    />
                    {showError('confirm', confirmError) && <span className="error-text">{confirmError}</span>}
                </label>

                {error && <p className="error-text" role="alert">{error}</p>}

                <button type="submit" className="btn btn-primary btn-block" disabled={!canSubmit}>
                    {status === 'loading' ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                </button>
                <p className="muted">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </form>
        </div>
    )
}

export default RegisterPage
