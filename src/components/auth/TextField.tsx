import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'id'> {
    label: string
    value: string
    onChange: (value: string) => void
    icon?: ReactNode
    error?: string | null
    hint?: ReactNode
}

function TextField({ label, value, onChange, icon, error, hint, ...input }: TextFieldProps) {
    const id = useId()
    return (
        <div className="auth-field">
            <label htmlFor={id}>{label}</label>
            <div className={icon ? 'input-wrap input-wrap--icon' : 'input-wrap'}>
                {icon && <span className="input-icon">{icon}</span>}
                <input {...input} id={id} value={value} aria-invalid={error ? true : undefined} onChange={(event) => onChange(event.target.value)} />
            </div>
            {error && <span className="error-text">{error}</span>}
            {hint}
        </div>
    )
}

export default TextField
