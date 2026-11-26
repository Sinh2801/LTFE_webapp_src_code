import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/auth/AuthShell'
import { MailIcon } from '../components/auth/Icons'
import OtpInput from '../components/auth/OtpInput'
import PasswordField from '../components/auth/PasswordField'
import PasswordStrength from '../components/auth/PasswordStrength'
import TextField from '../components/auth/TextField'
import { useToast } from '../components/common/Toast'
import { useCountdown } from '../hooks/useCountdown'
import { ApiError, getErrorMessage } from '../libs/apiClient'
import { authService } from '../libs/services'
import type { MailMessage } from '../libs/types'
import { normalizeEmail, passwordResults, validateEmail, validatePassword, validateResetCode } from '../libs/validation'

type Step = 'email' | 'code' | 'password' | 'done'

const STEPS: { id: Step; label: string }[] = [
    { id: 'email', label: 'Nhập email' },
    { id: 'code', label: 'Xác nhận mã' },
    { id: 'password', label: 'Mật khẩu mới' },
]

const formatClock = (seconds: number): string =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

function ForgotPasswordPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { showToast } = useToast()
    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState((location.state as { email?: string } | null)?.email ?? '')
    const [code, setCode] = useState('')
    const [resetToken, setResetToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [mailOpen, setMailOpen] = useState(false)
    const [mails, setMails] = useState<MailMessage[] | null>(null)
    const resend = useCountdown(0)
    const expiry = useCountdown(0)

    useEffect(() => { document.title = 'Quên mật khẩu | SourceCodeTST' }, [])

    const cleanEmail = normalizeEmail(email)
    const passwordError = validatePassword(newPassword)
    const confirmError = !confirm ? 'Vui lòng nhập lại mật khẩu' : confirm !== newPassword ? 'Mật khẩu nhập lại không khớp' : null
    const rules = passwordResults(newPassword)

    async function sendCode() {
        const message = validateEmail(email)
        if (message) return setError(message)
        setBusy(true)
        setError('')
        try {
            const result = await authService.forgotPassword(cleanEmail)
            resend.start(result.resendAfter)
            expiry.start(result.expiresIn)
            setCode('')
            setMails(null)
            setStep('code')
            showToast('Nếu email đã đăng ký, mã xác nhận đã được gửi', 'info')
        } catch (cause) {
            if (cause instanceof ApiError && cause.status === 429 && cause.retryAfter) {
                resend.start(cause.retryAfter)
                expiry.start(Math.max(1, 300 - (30 - cause.retryAfter)))
                setStep('code')
                showToast('Mã xác nhận vừa được gửi, hãy kiểm tra hộp thư', 'info')
            } else {
                setError(getErrorMessage(cause))
            }
        } finally {
            setBusy(false)
        }
    }

    async function verifyCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const message = validateResetCode(code)
        if (message) return setError(message)
        if (expiry.remaining <= 0) return setError('Mã đã hết hạn, hãy bấm gửi lại mã mới')
        setBusy(true)
        setError('')
        try {
            const result = await authService.verifyResetCode({ email: cleanEmail, code })
            setResetToken(result.resetToken)
            setStep('password')
        } catch (cause) {
            setError(getErrorMessage(cause))
            setCode('')
        } finally {
            setBusy(false)
        }
    }

    async function savePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitted(true)
        if (passwordError || confirmError) return
        setBusy(true)
        setError('')
        try {
            await authService.resetPassword({ email: cleanEmail, resetToken, newPassword })
            setStep('done')
            showToast('Đặt lại mật khẩu thành công', 'success')
        } catch (cause) {
            setError(getErrorMessage(cause))
        } finally {
            setBusy(false)
        }
    }

    async function openMailbox() {
        setMailOpen(true)
        try {
            setMails(await authService.devMailbox(cleanEmail))
        } catch {
            setMails([])
        }
    }

    const stepIndex = STEPS.findIndex((item) => item.id === step)
    const latestMail = mails?.[0]

    return (
        <AuthShell
            title="Lấy lại quyền truy cập"
            text="Chỉ mất vài bước: xác nhận email, nhập mã 6 số và đặt mật khẩu mới."
            items={['Mã xác nhận có hiệu lực 5 phút', 'Sai quá 5 lần sẽ phải xin mã mới', 'Đặt lại xong sẽ đăng xuất các thiết bị cũ']}
        >
            <div className="auth-card">
                <header className="auth-card__head">
                    <h1>Quên mật khẩu</h1>
                    <p>Nhớ ra rồi? <Link to="/login">Quay lại đăng nhập</Link></p>
                </header>

                {step !== 'done' && (
                    <ol className="auth-steps" aria-label="Các bước">
                        {STEPS.map((item, index) => (
                            <li key={item.id} className={index < stepIndex ? 'is-done' : index === stepIndex ? 'is-on' : ''} aria-current={index === stepIndex ? 'step' : undefined}>
                                <span>{index < stepIndex ? '✓' : index + 1}</span>{item.label}
                            </li>
                        ))}
                    </ol>
                )}

                {step === 'email' && (
                    <form className="auth-form" onSubmit={(event) => { event.preventDefault(); sendCode() }} noValidate>
                        <p className="auth-hint">Nhập email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận gồm 6 chữ số.</p>
                        <TextField label="Email" type="email" value={email} onChange={setEmail} icon={<MailIcon />} placeholder="ten@email.com" autoFocus autoComplete="email" maxLength={100} />
                        {error && <p className="auth-alert" role="alert">{error}</p>}
                        <button type="submit" className="auth-submit" disabled={busy}>{busy ? 'Đang gửi mã...' : 'Gửi mã xác nhận'}</button>
                    </form>
                )}

                {step === 'code' && (
                    <form className="auth-form" onSubmit={verifyCode} noValidate>
                        <p className="auth-hint">Mã gồm 6 chữ số đã được gửi tới <strong>{cleanEmail}</strong> (nếu email đã đăng ký). <button type="button" className="auth-linkbtn" onClick={() => { setStep('email'); setError('') }}>Đổi email</button></p>
                        <OtpInput value={code} onChange={(value) => { setCode(value); setError('') }} disabled={busy} invalid={!!error} />
                        <p className={expiry.remaining > 0 ? 'auth-timer' : 'auth-timer auth-timer--expired'} role="timer">
                            {expiry.remaining > 0 ? `Mã hết hạn sau ${formatClock(expiry.remaining)}` : 'Mã đã hết hạn, hãy gửi lại mã mới'}
                        </p>
                        {error && <p className="auth-alert" role="alert">{error}</p>}
                        <button type="submit" className="auth-submit" disabled={busy || code.length < 6 || expiry.remaining <= 0}>{busy ? 'Đang kiểm tra...' : 'Xác nhận mã'}</button>
                        <div className="auth-row auth-row--center">
                            <button type="button" className="auth-linkbtn" disabled={busy || resend.remaining > 0} onClick={sendCode}>
                                {resend.remaining > 0 ? `Gửi lại mã sau ${resend.remaining}s` : 'Gửi lại mã'}
                            </button>
                        </div>

                        <div className="devmail">
                            <button type="button" className="devmail__toggle" aria-expanded={mailOpen} onClick={() => (mailOpen ? setMailOpen(false) : openMailbox())}>
                                ✉ {mailOpen ? 'Đóng hộp thư giả lập' : 'Mở hộp thư giả lập (chỉ có ở bản demo)'}
                            </button>
                            {mailOpen && (
                                <div className="devmail__panel">
                                    {mails === null && <p>Đang tải thư...</p>}
                                    {mails !== null && !latestMail && <p>Chưa có thư nào cho email này. Email chưa đăng ký sẽ không nhận được mã (hệ thống không tiết lộ email có tồn tại hay không).</p>}
                                    {latestMail && (
                                        <>
                                            <strong>{latestMail.subject}</strong>
                                            <pre>{latestMail.body}</pre>
                                            <button type="button" className="btn-solid" onClick={() => { setCode(latestMail.code); setError('') }}>Điền mã {latestMail.code} vào ô</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </form>
                )}

                {step === 'password' && (
                    <form className="auth-form" onSubmit={savePassword} noValidate>
                        <p className="auth-success" role="status">Mã xác nhận hợp lệ. Hãy đặt mật khẩu mới cho <strong>{cleanEmail}</strong>.</p>
                        <PasswordField label="Mật khẩu mới" value={newPassword} onChange={setNewPassword} autoComplete="new-password" autoFocus error={submitted ? passwordError : null} hint={<PasswordStrength password={newPassword} />} />
                        <ul className="auth-rules">
                            {rules.map((r) => <li key={r.id} className={r.ok ? 'rule-ok' : newPassword ? 'rule-bad' : ''}>{r.ok ? '✓' : newPassword ? '✕' : '•'} {r.label}</li>)}
                        </ul>
                        <PasswordField label="Nhập lại mật khẩu mới" value={confirm} onChange={setConfirm} autoComplete="new-password" error={submitted ? confirmError : null} />
                        {error && <p className="auth-alert" role="alert">{error}</p>}
                        <button type="submit" className="auth-submit" disabled={busy}>{busy ? 'Đang lưu...' : 'Đặt lại mật khẩu'}</button>
                    </form>
                )}

                {step === 'done' && (
                    <div className="auth-done">
                        <span className="auth-done__icon" aria-hidden="true">✓</span>
                        <h2>Đặt lại mật khẩu thành công</h2>
                        <p>Các thiết bị đang đăng nhập bằng mật khẩu cũ đã được đăng xuất. Hãy đăng nhập bằng mật khẩu mới.</p>
                        <button type="button" className="auth-submit" onClick={() => navigate('/login', { replace: true, state: { email: cleanEmail, notice: 'Đặt lại mật khẩu thành công. Hãy đăng nhập bằng mật khẩu mới.' } })}>
                            Đến trang đăng nhập
                        </button>
                    </div>
                )}
            </div>
        </AuthShell>
    )
}

export default ForgotPasswordPage
