import { API_BASE } from '../libs/apiClient'
import { handleFakeRequest } from './handlers'

let installed = false

export function installFakeApi(): void {
    if (installed || typeof window === 'undefined') return
    installed = true

    const realFetch = window.fetch.bind(window)
    window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        if (typeof input !== 'string' && !(input instanceof URL)) return realFetch(input, init)
        const url = new URL(input.toString(), window.location.href)
        if (url.pathname === API_BASE || url.pathname.startsWith(`${API_BASE}/`)) {
            return handleFakeRequest(url, init)
        }
        return realFetch(input, init)
    }
}
