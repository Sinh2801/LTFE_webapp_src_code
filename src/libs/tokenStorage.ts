const KEY = 'token'

export const getToken = (): string | null => {
    try {
        return sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY)
    } catch {
        return null
    }
}

export const setToken = (token: string, remember = true): void => {
    try {
        sessionStorage.removeItem(KEY)
        localStorage.removeItem(KEY)
        ;(remember ? localStorage : sessionStorage).setItem(KEY, token)
    } catch {
    }
}

export const clearToken = (): void => {
    try {
        sessionStorage.removeItem(KEY)
        localStorage.removeItem(KEY)
    } catch {
    }
}