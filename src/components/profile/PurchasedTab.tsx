import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { fetchLibrary } from '../../app/slices/librarySlice'
import InstallGuide from '../product/InstallGuide'
import { useDownload } from '../../hooks/useDownload'
import { formatBytes, formatDate } from '../../libs/format'
import { warrantyFrom } from '../../libs/warranty'

interface PurchasedTabProps {
    onWarranty: (productId: string) => void
}
function PurchasedTab({ onWarranty }: PurchasedTabProps) {
    const dispatch = useAppDispatch()
    const { items, status, error } = useAppSelector((state) => state.library)
    const { download, busyId } = useDownload()
    const [openGuide, setOpenGuide] = useState<string | null>(null)

    if (status === 'loading' && items.length === 0) return <div className="loading" role="status"><span className="loading__spinner" />Đang tải thư viện...</div>
    if (status === 'failed' && items.length === 0) {
        return <div className="catalog-empty"><h3>Chưa tải được thư viện</h3><p>{error}</p><button type="button" onClick={() => dispatch(fetchLibrary())}>Thử lại</button></div>
    }
    if (items.length === 0) {
        return <div className="catalog-empty"><h3>Bạn chưa mua mã nguồn nào</h3><p>Sau khi thanh toán thành công, mã nguồn sẽ xuất hiện tại đây để tải về bất cứ lúc nào.</p><Link to="/products">Khám phá mã nguồn</Link></div>
    }

    return (
        <div className="acct-list">
            <p className="acct-note">Mua một lần, tải lại không giới hạn. Giấy phép và bảo hành tính theo từng mã nguồn.</p>
            {items.map((item) => {
                const warranty = warrantyFrom(item.purchasedAt)
                return (
                    <article className="acct-card purchase-card" key={item.id}>
                        <div className="purchase-card__top">
                            {item.thumbnail && <img src={item.thumbnail} alt="" />}
                            <div className="purchase-card__info">
                                <Link to={`/products/${item.id}`}><h3>{item.title}</h3></Link>
                                <p>Phiên bản {item.version} · Giấy phép {item.license} · {formatBytes(item.fileSize)}</p>
                                <p>Mua ngày {formatDate(item.purchasedAt)} · Đơn <Link to={`/orders/${item.orderId}`}>#{item.orderId}</Link></p>
                                <p>Đã tải {item.downloadCount} lần{item.lastDownloadedAt ? `, gần nhất ${formatDate(item.lastDownloadedAt, true)}` : ''}</p>
                                <span className={`badge badge--${warranty.active ? 'ok' : 'muted'}`}>{warranty.active ? `Còn ${warranty.daysLeft} ngày bảo hành` : `Hết bảo hành ${formatDate(warranty.expiresAt)}`}</span>
                            </div>
                        </div>
                        <div className="purchase-card__actions">
                            <button type="button" className="btn-solid" disabled={busyId === item.id} onClick={() => download(item.id)}>{busyId === item.id ? 'Đang tải...' : 'Tải xuống (.zip)'}</button>
                            <button type="button" className="btn-ghost" aria-expanded={openGuide === item.id} onClick={() => setOpenGuide(openGuide === item.id ? null : item.id)}>Hướng dẫn cài đặt</button>
                            <Link className="btn-ghost" to={`/products/${item.id}?tab=danh-gia`}>Đánh giá</Link>
                            <button type="button" className="btn-ghost" disabled={!warranty.active} title={warranty.active ? undefined : 'Đã hết thời hạn bảo hành'} onClick={() => onWarranty(item.id)}>Bảo hành</button>
                        </div>
                        {openGuide === item.id && <div className="purchase-card__guide"><InstallGuide product={item} /></div>}
                    </article>
                )
            })}
        </div>
    )
}

export default PurchasedTab
