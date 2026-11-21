import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { setUser, updateProfile } from '../../app/slices/authSlice'
import { useToast } from '../common/Toast'
import { formatDate } from '../../libs/format'
import { normalizeFullName, validateFullName } from '../../libs/validation'

function InfoTab() {
    const dispatch = useAppDispatch()
    const { showToast } = useToast()
    const user = useAppSelector((state) => state.auth.user)
    const library = useAppSelector((state) => state.library.items)
    const [fullName, setFullName] = useState(user?.fullName ?? '')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    if (!user) return null
    const latest = library[0]

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const message = validateFullName(fullName)
        if (message) return setError(message)
        setError('')
        setBusy(true)
        const result = await dispatch(updateProfile({ fullName: normalizeFullName(fullName) }))
        setBusy(false)
        if (updateProfile.fulfilled.match(result)) {
            dispatch(setUser(result.payload))
            showToast('Đã cập nhật họ tên', 'success')
        } else {
            setError(result.payload ?? 'Không cập nhật được')
        }
    }

    return (
        <div className="acct-grid">
            <form className="acct-card" onSubmit={save} noValidate>
                <h2>Thông tin cá nhân</h2>
                <label className="acct-field">
                    <span>Họ và tên</span>
                    <input value={fullName} maxLength={60} onChange={(event) => setFullName(event.target.value)} />
                </label>
                <label className="acct-field">
                    <span>Email (tên đăng nhập)</span>
                    <input value={user.email} readOnly />
                    <small>Email dùng để đăng nhập nên không thể thay đổi.</small>
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button type="submit" className="btn-solid" disabled={busy}>{busy ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
            </form>

            <aside className="acct-card acct-quick">
                <h2>Lối tắt</h2>
                <ul>
                    <li><Link to="/profile?tab=da-mua"><strong>Mã nguồn đã mua</strong><span>{library.length ? `${library.length} sản phẩm sẵn sàng tải` : 'Chưa có sản phẩm nào'}</span></Link></li>
                    <li><Link to="/profile?tab=bao-hanh"><strong>Bảo hành &amp; hỗ trợ</strong><span>Gửi yêu cầu trong 30 ngày kể từ ngày mua</span></Link></li>
                    <li><Link to="/favorites"><strong>Sản phẩm yêu thích</strong><span>Danh sách mã nguồn bạn đã lưu</span></Link></li>
                    <li><Link to="/chinh-sach"><strong>Chính sách &amp; hướng dẫn</strong><span>Bảo hành, hoàn tiền, cài đặt</span></Link></li>
                </ul>
                {latest && <p className="acct-quick__last">Mua gần nhất: <Link to={`/products/${latest.id}`}>{latest.title}</Link> ({formatDate(latest.purchasedAt)})</p>}
            </aside>
        </div>
    )
}

export default InfoTab
