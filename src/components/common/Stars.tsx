import { useState } from 'react'

interface StarsProps {
    value: number
    size?: number
}

export function Stars({ value, size = 16 }: StarsProps) {
    const percent = Math.max(0, Math.min(100, (value / 5) * 100))
    return (
        <span
            className="stars"
            role="img"
            aria-label={`${value.toFixed(1)} trên 5 sao`}
            style={{ fontSize: size, ['--fill' as string]: `${percent}%` }}
        >
            ★★★★★
        </span>
    )
}

const RATING_LABELS = ['', 'Rất tệ', 'Chưa tốt', 'Bình thường', 'Tốt', 'Tuyệt vời']

interface StarPickerProps {
    value: number
    onChange: (value: number) => void
    disabled?: boolean
}
export function StarPicker({ value, onChange, disabled }: StarPickerProps) {
    const [hover, setHover] = useState(0)
    const shown = hover || value
    return (
        <div className="star-picker">
            <fieldset disabled={disabled} onMouseLeave={() => setHover(0)}>
                <legend className="sr-only">Chấm điểm sản phẩm</legend>
                {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className={star <= shown ? 'is-on' : ''} onMouseEnter={() => setHover(star)}>
                        <input type="radio" name="rating" value={star} checked={value === star} onChange={() => onChange(star)} />
                        <span aria-hidden="true">★</span>
                        <span className="sr-only">{star} sao</span>
                    </label>
                ))}
            </fieldset>
            <span className="star-picker__label">{shown ? `${shown}/5 · ${RATING_LABELS[shown]}` : 'Chọn số sao'}</span>
        </div>
    )
}
