import { Stars } from '../common/Stars'
import type { ReviewSummary } from '../../libs/types'

function RatingSummary({ summary }: { summary: ReviewSummary }) {
    return (
        <div className="rating-summary">
            <div className="rating-summary__score">
                <strong>{summary.count ? summary.average.toFixed(1) : '—'}</strong>
                <Stars value={summary.average} size={20} />
                <span>{summary.count.toLocaleString('vi-VN')} đánh giá</span>
            </div>
            <ul className="rating-summary__bars" aria-label="Phân bố số sao">
                {([5, 4, 3, 2, 1] as const).map((star) => {
                    const total = summary.distribution[star]
                    const percent = summary.count ? Math.round((total / summary.count) * 100) : 0
                    return (
                        <li key={star}>
                            <span>{star} ★</span>
                            <div className="rating-summary__track"><i style={{ width: `${percent}%` }} /></div>
                            <span>{total}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default RatingSummary
