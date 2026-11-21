import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
export type Language = 'vi' | 'en'

export interface NotificationPrefs {
    orderUpdates: boolean
    warrantyUpdates: boolean
    promotions: boolean
}

export interface Preferences {
    theme: Theme
    language: Language
    notifications: NotificationPrefs
}

const NOTIFY_KEY = 'notification-prefs'
const DEFAULT_NOTIFICATIONS: NotificationPrefs = { orderUpdates: true, warrantyUpdates: true, promotions: false }

function readNotifications(): NotificationPrefs {
    try {
        const parsed = JSON.parse(localStorage.getItem(NOTIFY_KEY) ?? '{}') as Partial<NotificationPrefs>
        return {
            orderUpdates: parsed.orderUpdates ?? DEFAULT_NOTIFICATIONS.orderUpdates,
            warrantyUpdates: parsed.warrantyUpdates ?? DEFAULT_NOTIFICATIONS.warrantyUpdates,
            promotions: parsed.promotions ?? DEFAULT_NOTIFICATIONS.promotions,
        }
    } catch {
        return DEFAULT_NOTIFICATIONS
    }
}

function read(): Preferences {
    return {
        theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
        language: localStorage.getItem('language') === 'en' ? 'en' : 'vi',
        notifications: readNotifications(),
    }
}

let current: Preferences = read()
const listeners = new Set<() => void>()

function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme
}

function commit(next: Preferences): void {
    current = next
    try {
        localStorage.setItem('theme', next.theme)
        localStorage.setItem('language', next.language)
        localStorage.setItem(NOTIFY_KEY, JSON.stringify(next.notifications))
    } catch {
    }
    applyTheme(next.theme)
    listeners.forEach((listener) => listener())
}

applyTheme(current.theme)

export const preferences = {
    setTheme: (theme: Theme) => commit({ ...current, theme }),
    setLanguage: (language: Language) => commit({ ...current, language }),
    setNotification: (key: keyof NotificationPrefs, value: boolean) =>
        commit({ ...current, notifications: { ...current.notifications, [key]: value } }),
    reset: () => commit({ theme: 'light', language: 'vi', notifications: DEFAULT_NOTIFICATIONS }),
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener)
    const onStorage = () => {
        current = read()
        applyTheme(current.theme)
        listener()
    }
    window.addEventListener('storage', onStorage)
    return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
    }
}

export function usePreferences(): Preferences {
    return useSyncExternalStore(subscribe, () => current, () => current)
}
