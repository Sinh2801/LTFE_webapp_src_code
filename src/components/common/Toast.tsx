import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
    id: number
    message: string
    variant: ToastVariant
}

interface ToastContextValue {
    showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

interface ToastProviderProps {
    children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const nextId = useRef(1)
    const timers = useRef(new Map<number, number>())

    const dismissToast = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))

        const timer = timers.current.get(id)
        if (timer !== undefined) {
            window.clearTimeout(timer)
            timers.current.delete(id)
        }
    }, [])

    const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
        const id = nextId.current++
        setToasts((current) => [...current, { id, message, variant }])

        const timer = window.setTimeout(() => dismissToast(id), 4000)
        timers.current.set(id, timer)
    }, [dismissToast])

    useEffect(() => () => {
        timers.current.forEach((timer) => window.clearTimeout(timer))
        timers.current.clear()
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-region" role="region" aria-label="Thông báo">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast toast--${toast.variant}`}
                        role={toast.variant === 'error' ? 'alert' : 'status'}
                    >
                        <p className="toast__message">{toast.message}</p>
                        <button
                            className="toast__close"
                            type="button"
                            aria-label="Đóng thông báo"
                            onClick={() => dismissToast(toast.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('useToast must be used inside ToastProvider')
    }

    return context
}
