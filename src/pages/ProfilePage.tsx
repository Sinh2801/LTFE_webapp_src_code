import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { changePassword, setUser, updateProfile } from '../app/slices/authSlice'
import { orderService } from '../libs/services'
import type { Order } from '../libs/types'
import { loadOrders } from '../app/slices/orderSlice.ts'
import { formatPrice } from '../libs/format'
import { getErrorMessage } from '../libs/apiClient'
import { normalizeFullName, passwordResults, validateFullName, validatePassword } from '../libs/validation'

const TABS = [
    { id: 'thong-tin', label: 'Thông tin' },
    { id: 'mat-khau', label: 'Mật khẩu' },
    { id: 'don-hang', label: 'Đơn hàng' },
] as const

function ProfilePage() {
    const dispatch = useAppDispatch()
    const user = useAppSelector((s) => s.auth.user)
    const [params, setParams] = useSearchParams()
    const requestedTab = params.get('tab')
    const tab = requestedTab === 'mat-khau' || requestedTab === 'don-hang' ? requestedTab : 'thong-tin'
    const [fullName, setFullName] = useState(user?.fullName ?? '')
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
    const [busy, setBusy] = useState(false)
    const [orders, setOrders] = useState<Order[]>([])
    const [ordersStatus, setOrdersStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
    const [ordersError, setOrdersError] = useState('')

    useEffect(() => { document.title = 'Hồ sơ cá nhân | SourceCodeTST' }, [])

    useEffect(() => {
        if (tab !== 'don-hang') return
        let active = true
        setOrdersStatus('loading')
        setOrdersError('')
        orderService.list()
            .then((data) => {
                if (!active) return
                setOrders(data)
                dispatch(loadOrders(data))
                setOrdersStatus('loaded')
            })
            .catch((error: unknown) => {
                if (!active) return
                setOrdersError(getErrorMessage(error))
                setOrdersStatus('error')
            })
        return () => { active = false }
    }, [tab])

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

    const rules = passwordResults(next)

    return (
        <div className="profile-page">
            <div className="profile-head">
                <span className="profile-avatar">{user.fullName.charAt(0).toUpperCase()}</span>
                <div>
                    <h1>{user.fullName}</h1>
                    <p>{user.email}</p>
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

            {tab === 'don-hang' && (
                <div className="profile-orders">
                    {ordersStatus === 'loading' && <div className="loading" role="status">Đang tải đơn hàng...</div>}
                    {ordersStatus === 'error' && <p className="auth-alert" role="alert">{ordersError}</p>}
                    {ordersStatus === 'loaded' && orders.length === 0 && (
                        <div className="profile-panel profile-orders-empty">
                            <h3>Bạn chưa có đơn hàng</h3>
                            <p>Các đơn hàng của bạn sẽ hiển thị tại đây sau khi đặt mua.</p>
                            <Link className="profile-btn" to="/products">Khám phá mã nguồn</Link>
                        </div>
                    )}
                    {orders.map((order) => (
                        <article className="profile-panel profile-order" key={order.id}>
                            <div className="profile-order__heading">
                                <div>
                                    <strong>Đơn hàng #{order.id}</strong>
                                    <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}</time>
                                </div>
                                <span className={`profile-order__status profile-order__status--${order.status}`}>
                                    {order.status === 'paid' ? 'Đã thanh toán' : order.status === 'failed' ? 'Thanh toán thất bại' : 'Chờ thanh toán'}
                                </span>
                            </div>
                            <ul className="profile-order__items">
                                {order.items.map((item) => (
                                    <li key={item.productId}>
                                        <Link to={`/products/${item.productId}`}>{item.title}</Link>
                                        <div className="profile-order__item-actions">
                                            <span>{formatPrice(item.price)}</span>
                                            {order.status === 'paid' && (
                                                <button type="button" className="btn-download" onClick={() => {}}>
                                                    Tải xuống
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="profile-order__total"><span>Tổng đơn hàng</span><strong>{formatPrice(order.total)}</strong></div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProfilePage
