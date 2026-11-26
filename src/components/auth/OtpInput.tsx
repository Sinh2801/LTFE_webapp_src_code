import { useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import { RESET_CODE_LENGTH } from '../../libs/validation'

interface OtpInputProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    invalid?: boolean
}
function OtpInput({ value, onChange, disabled, invalid }: OtpInputProps) {
    const refs = useRef<(HTMLInputElement | null)[]>([])
    const digits = Array.from({ length: RESET_CODE_LENGTH }, (_, index) => value[index] ?? '')

    const focusAt = (index: number) => refs.current[Math.max(0, Math.min(RESET_CODE_LENGTH - 1, index))]?.focus()

    const setDigit = (index: number, digit: string) => {
        const next = digits.slice()
        next[index] = digit
        onChange(next.join(''))
    }

    const handleChange = (index: number, raw: string) => {
        const entered = raw.replace(/\D/g, '')
        if (!entered) return setDigit(index, '')
        if (entered.length > 1) {
            const merged = (value.slice(0, index) + entered).slice(0, RESET_CODE_LENGTH)
            onChange(merged)
            focusAt(merged.length)
            return
        }
        setDigit(index, entered)
        focusAt(index + 1)
    }

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !digits[index]) {
            event.preventDefault()
            focusAt(index - 1)
            if (index > 0) setDigit(index - 1, '')
        } else if (event.key === 'ArrowLeft') focusAt(index - 1)
        else if (event.key === 'ArrowRight') focusAt(index + 1)
    }

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, RESET_CODE_LENGTH)
        if (!pasted) return
        event.preventDefault()
        onChange(pasted)
        focusAt(pasted.length)
    }

    return (
        <div className={invalid ? 'otp otp--invalid' : 'otp'} role="group" aria-label="Mã xác nhận gồm 6 chữ số">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(element) => { refs.current[index] = element }}
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={RESET_CODE_LENGTH}
                    value={digit}
                    disabled={disabled}
                    aria-label={`Chữ số thứ ${index + 1}`}
                    onChange={(event) => handleChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    onFocus={(event) => event.target.select()}
                />
            ))}
        </div>
    )
}

export default OtpInput
