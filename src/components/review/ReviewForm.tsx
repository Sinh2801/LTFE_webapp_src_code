import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { editReview, fetchReviews, submitReview } from '../../app/slices/reviewSlice'
import { useToast } from '../common/Toast'
import { StarPicker } from '../common/Stars'
import type { Review } from '../../libs/types'
import { COMMENT_MAX, validateReview } from '../../libs/validation'

interface ReviewFormProps {
    productId: string
    existing: Review | null
    onClose?: () => void
}

function ReviewForm({ productId, existing, onClose }: ReviewFormProps) {
    const dispatch = useAppDispatch()
    const { showToast } = useToast()
    const submitting = useAppSelector((state) => state.reviews.submitting)
    const [rating, setRating] = useState(existing?.rating ?? 0)
    const [comment, setComment] = useState(existing?.comment ?? '')
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const message = validateReview(rating, comment)
        if (message) {
            setError(message)
            return
        }
        setError('')
        const result = existing
            ? await dispatch(editReview({ reviewId: existing.id, rating, comment }))
            : await dispatch(submitReview({ productId, rating, comment }))
        if (result.meta.requestStatus === 'fulfilled') {
            showToast(existing ? 'Đã cập nhật đánh giá của bạn' : 'Cảm ơn bạn đã đánh giá sản phẩm', 'success')
            await dispatch(fetchReviews(productId))
            onClose?.()
        } else {
            const text = String(result.payload ?? 'Không gửi được đánh giá')
            setError(text)
            showToast(text, 'error')
        }
    }

    return (
        <form className="review-form" onSubmit={handleSubmit} noValidate>
            <h3>{existing ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá của bạn'}</h3>
            <StarPicker value={rating} onChange={setRating} disabled={submitting} />
            <label className="review-form__field">
                <span>Nhận xét (không bắt buộc)</span>
                <textarea
                    value={comment}
                    maxLength={COMMENT_MAX}
                    rows={4}
                    placeholder="Chất lượng mã nguồn, mức độ dễ cài đặt, hỗ trợ kỹ thuật..."
                    onChange={(event) => setComment(event.target.value)}
                    disabled={submitting}
                />
                <small className={comment.length > COMMENT_MAX - 40 ? 'is-warn' : ''}>{comment.length}/{COMMENT_MAX}</small>
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="review-form__actions">
                <button type="submit" className="btn-solid" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : existing ? 'Lưu thay đổi' : 'Gửi đánh giá'}
                </button>
                {onClose && <button type="button" className="btn-ghost" onClick={onClose} disabled={submitting}>Hủy</button>}
            </div>
        </form>
    )
}

export default ReviewForm
