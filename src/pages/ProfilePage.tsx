import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { fetchLibrary } from '../app/slices/librarySlice'
import { fetchOrders } from '../app/slices/orderSlice'
import { fetchTickets } from '../app/slices/warrantySlice'
import InfoTab from '../components/profile/InfoTab'
import OrdersTab from '../components/profile/OrdersTab'
import PasswordTab from '../components/profile/PasswordTab'
import ProfileHero from '../components/profile/ProfileHero'
import PurchasedTab from '../components/profile/PurchasedTab'
import SettingsTab from '../components/profile/SettingsTab'
import WarrantyTab from '../components/profile/WarrantyTab'

const TAB_IDS = ['thong-tin', 'da-mua', 'don-hang', 'bao-hanh', 'mat-khau', 'cai-dat'] as const
type TabId = typeof TAB_IDS[number]

function ProfilePage() {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.auth.user)
    const libraryCount = useAppSelector((state) => state.library.items.length)
    const orderCount = useAppSelector((state) => state.orders.orders.length)
    const favoriteCount = useAppSelector((state) => state.favorites.items.length)
    const openTickets = useAppSelector((state) => state.warranty.tickets.filter((ticket) => ticket.status !== 'resolved').length)
    const [params, setParams] = useSearchParams()
    const requested = params.get('tab') as TabId | null
    const tab: TabId = requested && TAB_IDS.includes(requested) ? requested : 'thong-tin'

    useEffect(() => { document.title = 'Hồ sơ cá nhân | SourceCodeTST' }, [])
    useEffect(() => {
        dispatch(fetchLibrary())
        dispatch(fetchOrders())
        dispatch(fetchTickets())
    }, [dispatch])

    if (!user) return null

    const tabs: { id: TabId; label: string; count?: number }[] = [
        { id: 'thong-tin', label: 'Tổng quan' },
        { id: 'da-mua', label: 'Mã nguồn đã mua', count: libraryCount },
        { id: 'don-hang', label: 'Đơn hàng', count: orderCount },
        { id: 'bao-hanh', label: 'Bảo hành', count: openTickets },
        { id: 'mat-khau', label: 'Mật khẩu' },
        { id: 'cai-dat', label: 'Cài đặt' },
    ]

    function goTab(next: TabId, extra?: Record<string, string>) {
        setParams({ tab: next, ...extra }, { replace: true })
    }

    return (
        <main className="acct-page">
            <ProfileHero
                user={user}
                stats={[
                    { label: 'Mã nguồn đã mua', value: libraryCount },
                    { label: 'Đơn hàng', value: orderCount },
                    { label: 'Yêu thích', value: favoriteCount },
                    { label: 'Bảo hành đang mở', value: openTickets },
                ]}
            />

            <div className="acct-tabs" role="tablist" aria-label="Quản lý tài khoản">
                {tabs.map((item) => (
                    <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'is-on' : ''} onClick={() => goTab(item.id)}>
                        {item.label}{item.count ? <span className="acct-tabs__count">{item.count}</span> : null}
                    </button>
                ))}
            </div>

            <div className="acct-panel" role="tabpanel">
                {tab === 'thong-tin' && <InfoTab />}
                {tab === 'da-mua' && <PurchasedTab onWarranty={(productId) => goTab('bao-hanh', { product: productId })} />}
                {tab === 'don-hang' && <OrdersTab />}
                {tab === 'bao-hanh' && <WarrantyTab preselect={params.get('product') ?? undefined} />}
                {tab === 'mat-khau' && <PasswordTab />}
                {tab === 'cai-dat' && <SettingsTab />}
            </div>
        </main>
    )
}

export default ProfilePage
