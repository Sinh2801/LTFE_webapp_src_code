import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { clearAuthError, socialLogin } from '../app/slices/authSlice'
import { MailIcon, UserIcon } from '../components/auth/Icons'
import { FacebookIcon, GoogleIcon } from '../components/auth/SocialButtons'
import TextField from '../components/auth/TextField'
import { useToast } from '../components/common/Toast'
import { isSocialProvider, PROVIDERS } from '../libs/authProviders'
import { normalizeEmail, normalizeFullName, validateEmail, validateFullName } from '../libs/validation'

function SocialAuthPage() {
    const { provider } = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { showToast } = useToast()
    const { user, status, error } = useAppSelector((state) => state.auth)
    const [custom, setCustom] = useState(false)
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [formError, setFormError] = useState('')

    const from = (location.state as { from?: string } | null)?.from
    const info = isSocialProvider(provider) ? PROVIDERS[provider] : null

    useEffect(() => {
        document.title = `Đăng nhập bằng ${info?.name ?? 'mạng xã hội'} | SourceCodeTST`
        dispatch(clearAuthError())
    }, [dispatch, info])

    if (!info) return <Navigate to="/login" replace />
    if (user) return <Navigate to={from ?? '/'} replace />

    const busy = status === 'loading'

    async function signIn(account: { fullName: string; email: string }) {
        const result = await dispatch(socialLogin({ provider: info!.id, email: account.email, fullName: account.fullName }))
        if (socialLogin.fulfilled.match(result)) {
            const { isNewUser, linked } = result.payload
            showToast(
                isNewUser ? `Đã tạo tài khoản mới bằng ${info!.name}. Bạn có thể đặt mật khẩu trong Hồ sơ.`
                    : linked ? `Đã liên kết ${info!.name} với tài khoản hiện có của bạn`
                        : `Đăng nhập bằng ${info!.name} thành công`,
                'success',
            )
            navigate(from ?? '/', { replace: true })
        }
    }

    function submitCustom(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const emailMessage = validateEmail(email)
        const nameMessage = validateFullName(fullName)
        if (emailMessage || nameMessage) return setFormError(emailMessage ?? nameMessage ?? '')
        setFormError('')
        signIn({ fullName: normalizeFullName(fullName), email: normalizeEmail(email) })
    }

    const back = () => navigate('/login', { state: { from } })

    return (
        <div className="social-page">
            <div className={`social-window social-window--${info.id}`}>
                <header>
                    {info.id === 'google' ? <GoogleIcon /> : <FacebookIcon />}
                    <strong>Đăng nhập bằng {info.name}</strong>
                </header>
                <p className="social-window__demo" role="note">
                    Đây là màn hình <strong>mô phỏng</strong>. Bản demo không kết nối tới {info.name} thật và dữ liệu không rời khỏi trình duyệt của bạn.
                </p>
                <h1>Chọn tài khoản để tiếp tục tới <span>SourceCodeTST</span></h1>

                {error && <p className="auth-alert" role="alert">{error}</p>}

                {!custom ? (
                    <ul className="social-accounts">
                        {info.accounts.map((account) => (
                            <li key={account.email}>
                                <button type="button" disabled={busy} onClick={() => signIn(account)}>
                                    <span className="social-accounts__avatar" aria-hidden="true">{account.fullName.charAt(0)}</span>
                                    <span><strong>{account.fullName}</strong><small>{account.email}</small></span>
                                </button>
                            </li>
                        ))}
                        <li>
                            <button type="button" disabled={busy} onClick={() => setCustom(true)}>
                                <span className="social-accounts__avatar social-accounts__avatar--plus" aria-hidden="true">+</span>
                                <span><strong>Dùng tài khoản khác</strong><small>Tự nhập email và tên hiển thị</small></span>
                            </button>
                        </li>
                    </ul>
                ) : (
                    <form className="social-custom" onSubmit={submitCustom} noValidate>
                        <TextField label={`Email ${info.name}`} type="email" value={email} onChange={setEmail} icon={<MailIcon />} autoFocus maxLength={100} />
                        <TextField label="Tên hiển thị" value={fullName} onChange={setFullName} icon={<UserIcon />} maxLength={60} />
                        {formError && <p className="auth-alert" role="alert">{formError}</p>}
                        <div className="social-custom__actions">
                            <button type="button" className="btn-ghost" onClick={() => { setCustom(false); setFormError('') }}>Chọn tài khoản mẫu</button>
                            <button type="submit" className="btn-solid" disabled={busy}>Tiếp tục</button>
                        </div>
                    </form>
                )}

                {busy && <p className="muted" role="status">Đang đăng nhập...</p>}
                <footer>
                    <button type="button" className="auth-linkbtn" onClick={back} disabled={busy}>← Hủy và quay lại đăng nhập</button>
                    <Link to="/chinh-sach">Chính sách</Link>
                </footer>
            </div>
        </div>
    )
}

export default SocialAuthPage
