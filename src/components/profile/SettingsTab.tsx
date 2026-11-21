import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hook'
import { signOut } from '../../app/slices/authSlice'
import { useToast } from '../common/Toast'
import { preferences, usePreferences } from '../../hooks/usePreferences'
import type { NotificationPrefs } from '../../hooks/usePreferences'

const NOTIFICATIONS: { key: keyof NotificationPrefs; title: string; hint: string }[] = [
    { key: 'orderUpdates', title: 'Trạng thái đơn hàng', hint: 'Thông báo khi thanh toán thành công hoặc thất bại' },
    { key: 'warrantyUpdates', title: 'Phản hồi bảo hành', hint: 'Thông báo khi kỹ thuật viên cập nhật yêu cầu của bạn' },
    { key: 'promotions', title: 'Khuyến mãi & mã nguồn mới', hint: 'Bản tin hằng tuần về sản phẩm mới và ưu đãi' },
]
function SettingsTab() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { theme, language, notifications } = usePreferences()

    async function handleSignOut() {
        await dispatch(signOut())
        navigate('/')
    }

    return (
        <div className="acct-stack">
            <section className="acct-card">
                <h2>Giao diện</h2>
                <div className="setting-row">
                    <div><strong>Chế độ hiển thị</strong><span>Áp dụng cho toàn bộ website, giống nút trên thanh đầu trang.</span></div>
                    <div className="segmented" role="radiogroup" aria-label="Chế độ hiển thị">
                        <button type="button" role="radio" aria-checked={theme === 'light'} className={theme === 'light' ? 'is-on' : ''} onClick={() => preferences.setTheme('light')}>Sáng</button>
                        <button type="button" role="radio" aria-checked={theme === 'dark'} className={theme === 'dark' ? 'is-on' : ''} onClick={() => preferences.setTheme('dark')}>Tối</button>
                    </div>
                </div>
                <div className="setting-row">
                    <div><strong>Ngôn ngữ</strong><span>Bản tiếng Anh đang được hoàn thiện, nội dung hiện hiển thị bằng tiếng Việt.</span></div>
                    <select aria-label="Ngôn ngữ" value={language} onChange={(event) => preferences.setLanguage(event.target.value as 'vi' | 'en')}>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </section>

            <section className="acct-card">
                <h2>Thông báo</h2>
                {NOTIFICATIONS.map((item) => (
                    <label className="setting-row setting-row--switch" key={item.key}>
                        <div><strong>{item.title}</strong><span>{item.hint}</span></div>
                        <input type="checkbox" role="switch" checked={notifications[item.key]} onChange={(event) => preferences.setNotification(item.key, event.target.checked)} />
                    </label>
                ))}
                <p className="acct-note">Cài đặt được lưu trên trình duyệt này.</p>
            </section>

            <section className="acct-card">
                <h2>Tài khoản</h2>
                <div className="setting-row">
                    <div><strong>Khôi phục cài đặt mặc định</strong><span>Đặt lại giao diện, ngôn ngữ và thông báo.</span></div>
                    <button type="button" className="btn-ghost" onClick={() => { preferences.reset(); showToast('Đã khôi phục cài đặt mặc định', 'info') }}>Khôi phục</button>
                </div>
                <div className="setting-row">
                    <div><strong>Đăng xuất</strong><span>Kết thúc phiên đăng nhập trên thiết bị này.</span></div>
                    <button type="button" className="btn-danger" onClick={handleSignOut}>Đăng xuất</button>
                </div>
            </section>
        </div>
    )
}

export default SettingsTab
