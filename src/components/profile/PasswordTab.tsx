import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { changePassword, restoreSession } from '../../app/slices/authSlice'
import PasswordField from '../auth/PasswordField'
import PasswordStrength from '../auth/PasswordStrength'
import { useToast } from '../common/Toast'
import type { AuthProvider } from '../../libs/types'
import { passwordResults, validatePassword } from '../../libs/validation'

const PROVIDER_LABEL: Record<AuthProvider, string> = { password: 'Email và mật khẩu', google: 'Google', facebook: 'Facebook' }

function PasswordTab() {
    const dispatch = useAppDispatch()
    const { showToast } = useToast()
    const user = useAppSelector((state) => state.auth.user)
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)
    const rules = passwordResults(next)
    const hasPassword = user?.hasPassword !== false
    const providers = user?.providers ?? ['password']

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const message = validatePassword(next)
        if (message) return setError(message)
        if (next !== confirm) return setError('Mật khẩu nhập lại không khớp')
        setError('')
        setBusy(true)
        const result = await dispatch(changePassword({ currentPassword: hasPassword ? current : undefined, newPassword: next }))
        setBusy(false)
        if (changePassword.fulfilled.match(result)) {
            setCurrent(''); setNext(''); setConfirm('')
            showToast(hasPassword ? 'Đã đổi mật khẩu' : 'Đã tạo mật khẩu, từ giờ bạn có thể đăng nhập bằng email và mật khẩu', 'success')
            dispatch(restoreSession())
        } else {
            setError(result.payload ?? 'Không đổi được mật khẩu')
        }
    }

    return (
        <div className="acct-stack">
            <section className="acct-card acct-card--narrow">
                <h2>Cách đăng nhập của bạn</h2>
                <ul className="provider-list">
                    {(['password', 'google', 'facebook'] as AuthProvider[]).map((provider) => {
                        const linked = providers.includes(provider) && (provider !== 'password' || hasPassword)
                        return (
                            <li key={provider}>
                                <span>{PROVIDER_LABEL[provider]}</span>
                                <span className={linked ? 'badge badge--ok' : 'badge badge--muted'}>{linked ? 'Đã liên kết' : 'Chưa liên kết'}</span>
                            </li>
                        )
                    })}
                </ul>
                {!hasPassword && <p className="acct-note">Tài khoản của bạn đang đăng nhập bằng mạng xã hội. Hãy tạo mật khẩu để có thêm cách đăng nhập dự phòng.</p>}
            </section>

            <form className="acct-card acct-card--narrow" onSubmit={save} noValidate>
                <h2>{hasPassword ? 'Đổi mật khẩu' : 'Tạo mật khẩu'}</h2>
                {hasPassword && <PasswordField label="Mật khẩu hiện tại" value={current} onChange={setCurrent} autoComplete="current-password" />}
                <PasswordField label={hasPassword ? 'Mật khẩu mới' : 'Mật khẩu'} value={next} onChange={setNext} autoComplete="new-password" hint={<PasswordStrength password={next} />} />
                <ul className="auth-rules">{rules.map((rule) => <li key={rule.id} className={rule.ok ? 'rule-ok' : next ? 'rule-bad' : ''}>{rule.ok ? '✓' : next ? '✕' : '•'} {rule.label}</li>)}</ul>
                <PasswordField label="Nhập lại mật khẩu" value={confirm} onChange={setConfirm} autoComplete="new-password" />
                {error && <p className="form-error" role="alert">{error}</p>}
                <button type="submit" className="btn-solid" disabled={busy}>{busy ? 'Đang lưu...' : hasPassword ? 'Đổi mật khẩu' : 'Tạo mật khẩu'}</button>
            </form>
        </div>
    )
}

export default PasswordTab
