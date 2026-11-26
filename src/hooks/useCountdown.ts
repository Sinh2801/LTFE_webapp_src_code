import { useCallback, useEffect, useState } from 'react'

export function useCountdown(initial = 0) {
    const [remaining, setRemaining] = useState(initial)

    useEffect(() => {
        if (remaining <= 0) return
        const timer = window.setTimeout(() => setRemaining((value) => Math.max(0, value - 1)), 1000)
        return () => window.clearTimeout(timer)
    }, [remaining])

    const start = useCallback((seconds: number) => setRemaining(Math.max(0, Math.ceil(seconds))), [])
    return { remaining, start }
}
