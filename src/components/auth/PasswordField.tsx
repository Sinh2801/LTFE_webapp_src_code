import { useId, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { EyeIcon, EyeOffIcon, LockIcon } from './Icons'

interface PasswordFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    autoComplete: 'current-password' | 'new-password'
    error?: string | null
    hint?: ReactNode
    maxLength?: number
    disabled?: boolean
    autoFocus?: boolean
}

function PasswordField({ label, value, onChange, autoComplete, error, hint, maxLength = 64, disabled, autoFocus }: PasswordFieldProps) {
    const id = useId()
    const [visible, setVisible] = useState(false)
    const [capsLock, setCapsLock] = useState(false)

    const checkCaps = (event: KeyboardEvent<HTMLInputElement>) => setCapsLock(event.getModifierState('CapsLock'))
    const toggleLabel = visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'

    return (
        <div className="auth-field">
            <label htmlFor={id}>{label}</label>
            <div className="input-wrap input-wrap--icon input-wrap--action">
                <span className="input-icon"><LockIcon /></span>
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyUp={checkCaps}
                    onKeyDown={checkCaps}
                    onBlur={() => setCapsLock(false)}
                />
                <button type="button" className="input-action" aria-pressed={visible} aria-label={toggleLabel} title={toggleLabel} onClick={() => setVisible((current) => !current)}>
                    {visible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {capsLock && <span className="muted" role="status">⚠ Caps Lock đang bật</span>}
            {error && <span className="error-text">{error}</span>}
            {hint}
        </div>
    )
}

export default PasswordField
