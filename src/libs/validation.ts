export const FULL_NAME_MIN = 2
export const FULL_NAME_MAX = 50
export const EMAIL_MAX = 100
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 64

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
const NAME_RE = /^\p{L}[\p{L} ]*$/u

export function normalizeEmail(value: string): string {
    return value.trim().toLowerCase()
}

export function normalizeFullName(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
}

export function validateFullName(value: string): string | null {
    const name = normalizeFullName(value)
    if (name.length < FULL_NAME_MIN) return `Họ tên phải có ít nhất ${FULL_NAME_MIN} ký tự`
    if (name.length > FULL_NAME_MAX) return `Họ tên tối đa ${FULL_NAME_MAX} ký tự`
    if (!NAME_RE.test(name)) return 'Họ tên chỉ được chứa chữ cái và khoảng trắng, không có số hay ký tự đặc biệt'
    return null
}

export function validateEmail(value: string): string | null {
    const email = normalizeEmail(value)
    if (!email) return 'Vui lòng nhập email'
    if (email.length > EMAIL_MAX) return `Email tối đa ${EMAIL_MAX} ký tự`
    if (!EMAIL_RE.test(email)) return 'Email không đúng định dạng (ví dụ: ten@gmail.com)'
    return null
}

export interface PasswordRule {
    id: string
    label: string
    test: (password: string) => boolean
}

export const PASSWORD_RULES: PasswordRule[] = [
    {
        id: 'length',
        label: `Từ ${PASSWORD_MIN} đến ${PASSWORD_MAX} ký tự`,
        test: (p) => p.length >= PASSWORD_MIN && p.length <= PASSWORD_MAX,
    },
    { id: 'upper', label: 'Có ít nhất 1 chữ in hoa (A–Z)', test: (p) => /\p{Lu}/u.test(p) },
    { id: 'lower', label: 'Có ít nhất 1 chữ thường (a–z)', test: (p) => /\p{Ll}/u.test(p) },
    { id: 'digit', label: 'Có ít nhất 1 chữ số (0–9)', test: (p) => /\p{Nd}/u.test(p) },
    { id: 'special', label: 'Có ít nhất 1 ký tự đặc biệt (ví dụ ! @ # $ %)', test: (p) => /[^\p{L}\p{N}\s]/u.test(p) },
    { id: 'nospace', label: 'Không chứa khoảng trắng', test: (p) => !/\s/.test(p) },
]

export function passwordResults(password: string): { id: string; label: string; ok: boolean }[] {
    return PASSWORD_RULES.map((rule) => ({ id: rule.id, label: rule.label, ok: rule.test(password) }))
}
export function validatePassword(password: string): string | null {
    const failed = PASSWORD_RULES.find((rule) => !rule.test(password))
    return failed ? `Mật khẩu chưa đạt: ${failed.label.toLowerCase()}` : null
}

export function validateLoginPassword(password: string): string | null {
    return password.length > 0 ? null : 'Vui lòng nhập mật khẩu'
}
