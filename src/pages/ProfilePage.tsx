import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { changePassword, setUser, updateProfile } from '../app/slices/authSlice'
import { userService } from '../libs/services'
import { getErrorMessage } from '../libs/apiClient'
import { normalizeFullName, passwordResults, validateFullName, validatePassword } from '../libs/validation'

const TABS = [
    { id: 'thong-tin', label: 'Thông tin' },
    { id: 'mat-khau', label: 'Mật khẩu' },
    { id: 'ban', label: 'Bán hàng' },
] as const

function ProfilePage() {
    const dispatch = useAppDispatch()
    const user = useAppSelector((s) => s.auth.user)
    const [params, setParams] = useSearchParams()
    const tab = params.get('tab') ?? 'thong-tin'
    const [fullName, setFullName] = useState(user?.fullName ?? '')
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
    const [busy, setBusy] = useState(false)

    useEffect(() => { document.title = 'Hồ sơ cá nhân | SourceCodeTST' }, [])
    if (!user) return null

    const flash = (ok: boolean, text: string) => setMsg({ ok, text })

    const saveName = async (e: FormEvent) => {
        e.preventDefault()
        setMsg(null)
        const err = validateFullName(fullName)
        if (err) return flash(false, err)
        setBusy(true)
        const r = await dispatch(updateProfile({ fullName: normalizeFullName(fullName) }))
        setBusy(false)
        if (updateProfile.fulfilled.match(r)) {
            dispatch(setUser(r.payload))
            flash(true, 'Đã cập nhật họ tên')
        } else flash(false, r.payload ?? 'Không cập nhật được')
    }

    const savePassword = async (e: FormEvent) => {
        e.preventDefault()
        setMsg(null)
        const err = validatePassword(next)
        if (err) return flash(false, err)
        if (next !== confirm) return flash(false, 'Mật khẩu nhập lại không khớp')
        setBusy(true)
        const r = await dispatch(changePassword({ currentPassword: current, newPassword: next }))
        setBusy(false)
        if (changePassword.fulfilled.match(r)) {
            setCurrent(''); setNext(''); setConfirm('')
            flash(true, 'Đã đổi mật khẩu')
        } else flash(false, r.payload ?? 'Không đổi được mật khẩu')
    }

    const becomeSeller = async () => {
        setMsg(null)
        setBusy(true)
        try {
            const updated = await userService.becomeSeller()
            dispatch(setUser(updated))
            flash(true, 'Chúc mừng! Bạn đã trở thành người bán')
        } catch (e) {
            flash(false, getErrorMessage(e))
        } finally {
            setBusy(false)
        }
    }

    const rules = passwordResults(next)

    return (
        <div className="profile-page">
            <div className="profile-head">
                <span className="profile-avatar">{user.fullName.charAt(0).toUpperCase()}</span>
                <div>
                    <h1>{user.fullName}</h1>
                    <p>{user.email} · {user.role === 'seller' ? 'Người bán' : 'Người mua'}</p>
                </div>
            </div>

            <div className="profile-tabs" role="tablist">
                {TABS.map((t) => (
                    <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'is-on' : ''} onClick={() => { setMsg(null); setParams({ tab: t.id }, { replace: true }) }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {msg && <p className={msg.ok ? 'profile-ok' : 'auth-alert'} role="status">{msg.text}</p>}

            {tab === 'thong-tin' && (
                <form className="profile-panel" onSubmit={saveName} noValidate>
                    <label className="auth-field"><span>Họ và tên</span><input value={fullName} maxLength={60} onChange={(e) => setFullName(e.target.value)} /></label>
                    <button type="submit" className="profile-btn" disabled={busy}>Lưu thay đổi</button>
                </form>
            )}

            {tab === 'mat-khau' && (
                <form className="profile-panel" onSubmit={savePassword} noValidate>
                    <label className="auth-field"><span>Mật khẩu hiện tại</span><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></label>
                    <label className="auth-field"><span>Mật khẩu mới</span><input type="password" value={next} onChange={(e) => setNext(e.target.value)} /></label>
                    <ul className="auth-rules">{rules.map((r) => <li key={r.id} className={r.ok ? 'rule-ok' : next ? 'rule-bad' : ''}>{r.ok ? '✓' : next ? '✕' : '•'} {r.label}</li>)}</ul>
                    <label className="auth-field"><span>Nhập lại mật khẩu mới</span><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label>
                    <button type="submit" className="profile-btn" disabled={busy}>Đổi mật khẩu</button>
                </form>
            )}

            {tab === 'ban' && (
                <div className="profile-panel">
                    {user.role === 'seller' ? (
                        <>
                            <h3>✓ Bạn đang là người bán</h3>
                            <p>Quản lý sản phẩm, đơn bán và đánh giá trong kênh người bán.</p>
                        </>
                    ) : (
                        <>
                            <h3>Trở thành người bán</h3>
                            <p>Đăng sản phẩm mã nguồn, nhận đơn hàng và theo dõi doanh thu. Tài khoản vẫn dùng để mua hàng bình thường.</p>
                            <button type="button" className="profile-btn" onClick={becomeSeller} disabled={busy}>Đăng ký làm người bán</button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProfilePage
