import { passwordStrength } from '../../libs/validation'

function PasswordStrength({ password }: { password: string }) {
    const { score, label } = passwordStrength(password)
    if (!password) return null
    return (
        <div className={`strength strength--${score}`} role="status" aria-label={`Độ mạnh mật khẩu: ${label}`}>
            <div className="strength__bars" aria-hidden="true">
                {[1, 2, 3, 4].map((step) => <i key={step} className={step <= score ? 'is-on' : ''} />)}
            </div>
            <span>Độ mạnh: <strong>{label}</strong></span>
        </div>
    )
}

export default PasswordStrength
