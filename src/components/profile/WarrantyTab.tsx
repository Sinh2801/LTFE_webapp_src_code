import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { createTicket, fetchTickets } from '../../app/slices/warrantySlice'
import WarrantyPolicy from '../product/WarrantyPolicy'
import { useToast } from '../common/Toast'
import { formatDate } from '../../libs/format'
import type { WarrantyType } from '../../libs/types'
import {
    WARRANTY_DAYS, WARRANTY_DESC_MAX, WARRANTY_DESC_MIN, WARRANTY_STATUS_LABEL, WARRANTY_TYPES, warrantyFrom,
} from '../../libs/warranty'

const POLL_MS = 4000

function WarrantyTab({ preselect }: { preselect?: string }) {
    const dispatch = useAppDispatch()
    const { showToast } = useToast()
    const library = useAppSelector((state) => state.library.items)
    const { tickets, status, submitting } = useAppSelector((state) => state.warranty)
    const eligible = library.filter((item) => warrantyFrom(item.purchasedAt).active)
    const firstEligible = eligible.find((item) => item.id === preselect)?.id ?? eligible[0]?.id ?? ''
    const [productId, setProductId] = useState('')
    const [type, setType] = useState<WarrantyType>('bug')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')
    const selected = productId || firstEligible
    const hasActive = tickets.some((ticket) => ticket.status !== 'resolved')

    useEffect(() => {
        if (!hasActive) return
        const timer = window.setInterval(() => { dispatch(fetchTickets()) }, POLL_MS)
        return () => window.clearInterval(timer)
    }, [dispatch, hasActive])

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const text = description.trim()
        if (!selected) return setError('Bạn chưa có mã nguồn nào còn thời hạn bảo hành')
        if (text.length < WARRANTY_DESC_MIN || text.length > WARRANTY_DESC_MAX) {
            return setError(`Mô tả vấn đề từ ${WARRANTY_DESC_MIN} đến ${WARRANTY_DESC_MAX} ký tự`)
        }
        setError('')
        const result = await dispatch(createTicket({ productId: selected, type, description: text }))
        if (createTicket.fulfilled.match(result)) {
            setDescription('')
            showToast('Đã tiếp nhận yêu cầu bảo hành', 'success')
        } else {
            setError(result.payload ?? 'Không gửi được yêu cầu')
        }
    }

    return (
        <div className="acct-stack">
            <section className="acct-card">
                <h2>Gửi yêu cầu bảo hành</h2>
                {library.length === 0 && <p className="acct-note">Bạn cần mua mã nguồn trước khi gửi yêu cầu bảo hành. Thời hạn bảo hành là {WARRANTY_DAYS} ngày kể từ ngày thanh toán.</p>}
                {library.length > 0 && eligible.length === 0 && <p className="acct-note">Tất cả mã nguồn của bạn đã hết thời hạn bảo hành {WARRANTY_DAYS} ngày.</p>}
                {library.length > 0 && (
                    <form onSubmit={submit} noValidate className="warranty-form">
                        <label className="acct-field">
                            <span>Mã nguồn cần hỗ trợ</span>
                            <select value={selected} onChange={(event) => setProductId(event.target.value)} disabled={eligible.length === 0}>
                                {library.map((item) => {
                                    const info = warrantyFrom(item.purchasedAt)
                                    return <option key={item.id} value={item.id} disabled={!info.active}>{item.title}{info.active ? ` · còn ${info.daysLeft} ngày` : ' · đã hết bảo hành'}</option>
                                })}
                            </select>
                        </label>
                        <fieldset className="warranty-types">
                            <legend>Loại vấn đề</legend>
                            {WARRANTY_TYPES.map((item) => (
                                <label key={item.value} className={type === item.value ? 'is-on' : ''}>
                                    <input type="radio" name="warranty-type" checked={type === item.value} onChange={() => setType(item.value)} />
                                    <strong>{item.label}</strong>
                                    <span>{item.hint}</span>
                                </label>
                            ))}
                        </fieldset>
                        <label className="acct-field">
                            <span>Mô tả vấn đề</span>
                            <textarea rows={5} maxLength={WARRANTY_DESC_MAX} value={description} placeholder="Nêu rõ thông báo lỗi, bước bạn đã thực hiện, phiên bản Node.js/hệ điều hành đang dùng..." onChange={(event) => setDescription(event.target.value)} />
                            <small>{description.trim().length}/{WARRANTY_DESC_MAX} (tối thiểu {WARRANTY_DESC_MIN} ký tự)</small>
                        </label>
                        {error && <p className="form-error" role="alert">{error}</p>}
                        <button type="submit" className="btn-solid" disabled={submitting || eligible.length === 0}>{submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
                    </form>
                )}
            </section>

            <section className="acct-card">
                <h2>Yêu cầu của bạn</h2>
                {status === 'loading' && tickets.length === 0 && <div className="loading" role="status"><span className="loading__spinner" />Đang tải...</div>}
                {status !== 'loading' && tickets.length === 0 && <p className="acct-note">Bạn chưa gửi yêu cầu bảo hành nào.</p>}
                <ul className="ticket-list">
                    {tickets.map((ticket) => (
                        <li key={ticket.id} className="ticket">
                            <div className="ticket__head">
                                <strong>{ticket.productTitle}</strong>
                                <span className={`badge badge--${ticket.status === 'resolved' ? 'ok' : ticket.status === 'processing' ? 'info' : 'warn'}`}>{WARRANTY_STATUS_LABEL[ticket.status]}</span>
                            </div>
                            <p className="ticket__meta">{WARRANTY_TYPES.find((item) => item.value === ticket.type)?.label} · gửi lúc {formatDate(ticket.createdAt, true)} · mã #{ticket.id}</p>
                            <p>{ticket.description}</p>
                            {ticket.reply && <div className="ticket__reply"><strong>Phản hồi từ kỹ thuật viên</strong><p>{ticket.reply}</p></div>}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="acct-card">
                <h2>Chính sách bảo hành</h2>
                <WarrantyPolicy compact />
            </section>
        </div>
    )
}

export default WarrantyTab
