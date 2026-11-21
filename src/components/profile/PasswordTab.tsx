import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch } from '../../app/hook'
import { changePassword } from '../../app/slices/authSlice'
import { useToast } from '../common/Toast'
import { passwordResults, validatePassword } from '../../libs/validation'

function PasswordTab() {
    const dispatch = useAppDispatch()
    const { showToast } = useToast()
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)
    const rules = passwordResults(next)

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const message = validatePassword(next)
        if (message) return setError(message)
        if (next !== confirm) return setError('Mật khẩu nhập lại không khớp')
        setError('')
        setBusy(true)
        const result = await dispatch(changePassword({ currentPassword: current, newPassword: next }))
        setBusy(false)
        if (changePassword.fulfilled.match(result)) {
            setCurrent(''); setNext(''); setConfirm('')
            showToast('Đã đổi mật khẩu', 'success')
        } else {
            setError(result.payload ?? 'Không đổi được mật khẩu')
        }
    }

    return (
        <form className="acct-card acct-card--narrow" onSubmit={save} noValidate>
            <h2>Đổi mật khẩu</h2>
            <label className="acct-field"><span>Mật khẩu hiện tại</span><input type="password" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} /></label>
            <label className="acct-field"><span>Mật khẩu mới</span><input type="password" autoComplete="new-password" value={next} onChange={(event) => setNext(event.target.value)} /></label>
            <ul className="auth-rules">{rules.map((rule) => <li key={rule.id} className={rule.ok ? 'rule-ok' : next ? 'rule-bad' : ''}>{rule.ok ? '✓' : next ? '✕' : '•'} {rule.label}</li>)}</ul>
            <label className="acct-field"><span>Nhập lại mật khẩu mới</span><input type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="btn-solid" disabled={busy}>{busy ? 'Đang lưu...' : 'Đổi mật khẩu'}</button>
        </form>
    )
}

export default PasswordTab
