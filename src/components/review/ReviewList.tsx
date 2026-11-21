import { useMemo, useState } from 'react'
import { Stars } from '../common/Stars'
import { formatDate } from '../../libs/format'
import type { Review } from '../../libs/types'

type ReviewSort = 'newest' | 'highest' | 'lowest'
const PAGE_SIZE = 5

function ReviewList({ items, mineId }: { items: Review[]; mineId?: string }) {
    const [sort, setSort] = useState<ReviewSort>('newest')
    const [visible, setVisible] = useState(PAGE_SIZE)

    const sorted = useMemo(() => {
        const list = [...items]
        if (sort === 'highest') list.sort((a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt))
        else if (sort === 'lowest') list.sort((a, b) => a.rating - b.rating || b.createdAt.localeCompare(a.createdAt))
        else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        return list
    }, [items, sort])

    if (items.length === 0) {
        return <p className="review-empty">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm sau khi mua.</p>
    }

    return (
        <div className="review-list">
            <div className="review-list__toolbar">
                <strong>{items.length} đánh giá</strong>
                <label>
                    <span className="sr-only">Sắp xếp đánh giá</span>
                    <select value={sort} onChange={(event) => { setSort(event.target.value as ReviewSort); setVisible(PAGE_SIZE) }}>
                        <option value="newest">Mới nhất</option>
                        <option value="highest">Điểm cao nhất</option>
                        <option value="lowest">Điểm thấp nhất</option>
                    </select>
                </label>
            </div>
            <ul>
                {sorted.slice(0, visible).map((review) => (
                    <li key={review.id} className={review.id === mineId ? 'review-item is-mine' : 'review-item'}>
                        <span className="review-item__avatar" aria-hidden="true">{review.userName.charAt(0).toUpperCase()}</span>
                        <div>
                            <div className="review-item__head">
                                <strong>{review.userName}</strong>
                                {review.id === mineId && <span className="badge badge--info">Của bạn</span>}
                                <span className="badge badge--ok">✓ Đã mua hàng</span>
                            </div>
                            <div className="review-item__meta">
                                <Stars value={review.rating} size={14} />
                                <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
                                {review.updatedAt && <em>(đã chỉnh sửa)</em>}
                            </div>
                            {review.comment && <p>{review.comment}</p>}
                        </div>
                    </li>
                ))}
            </ul>
            {visible < sorted.length && (
                <button type="button" className="btn-ghost review-list__more" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
                    Xem thêm {Math.min(PAGE_SIZE, sorted.length - visible)} đánh giá
                </button>
            )}
        </div>
    )
}

export default ReviewList
