import { getToken } from './tokenStorage.ts'

// Client dùng chung: khi gọi API đi qua file này, không gọi fetch trực tiếp trong component.
export const API_BASE = '/api/v1'

export class ApiError extends Error {
    status: number
    errors: string[]

    constructor(status: number, message: string, errors: string[] = []) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.errors = errors
    }
}

interface ApiPayload {
    success?: boolean
    message?: string
    data?: unknown
    errors?: string[]
}

type QueryValue = string | number | boolean | null | undefined

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: unknown
    auth?: boolean
    query?: Record<string, QueryValue>
}

function isFormData(body: unknown): body is FormData {
    return typeof FormData !== 'undefined' && body instanceof FormData
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
    const search = new URLSearchParams()
    if (query) {
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
        }
    }
    const qs = search.toString()
    return `${API_BASE}${path}${qs ? `?${qs}` : ''}`
}

function authHeader(auth: boolean): Record<string, string> {
    if (!auth) return {}
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

async function readPayload(res: Response): Promise<ApiPayload | null> {
    const text = await res.text()
    if (!text) return null
    try {
        return JSON.parse(text) as ApiPayload
    } catch {
        return null
    }
}

function defaultMessage(status: number): string {
    if (status === 401) return 'Bạn cần đăng nhập để thực hiện thao tác này'
    if (status === 403) return 'Bạn không có quyền thực hiện thao tác này'
    if (status === 404) return 'Không tìm thấy dữ liệu'
    return 'Có lỗi xảy ra, vui lòng thử lại'
}

function handleUnauthorized(status: number, auth: boolean): void {
    // Token hết hạn/không hợp lệ: store sẽ đăng xuất người dùng
    if (status === 401 && auth) window.dispatchEvent(new Event('auth:unauthorized'))
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = true, query } = options
    const headers: Record<string, string> = { Accept: 'application/json', ...authHeader(auth) }
    if (body !== undefined && !isFormData(body)) headers['Content-Type'] = 'application/json'

    const res = await fetch(buildUrl(path, query), {
        method,
        headers,
        body: body === undefined ? undefined : isFormData(body) ? body : JSON.stringify(body),
    })
    const payload = await readPayload(res)

    if (!res.ok) {
        handleUnauthorized(res.status, auth)
        throw new ApiError(res.status, payload?.message ?? defaultMessage(res.status), payload?.errors ?? [])
    }
    return (payload?.data ?? null) as T
}

export const api = {
    get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(path, { ...options, method: 'POST', body }),
    put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
        request<T>(path, { ...options, method: 'PUT', body }),
}

export async function downloadFile(path: string): Promise<{ blob: Blob; filename: string }> {
    const res = await fetch(buildUrl(path), { headers: authHeader(true) })
    if (!res.ok) {
        const payload = await readPayload(res)
        handleUnauthorized(res.status, true)
        throw new ApiError(res.status, payload?.message ?? defaultMessage(res.status), payload?.errors ?? [])
    }
    const disposition = res.headers.get('Content-Disposition') ?? ''
    const match = /filename="([^"]+)"/i.exec(disposition)
    return { blob: await res.blob(), filename: match?.[1] ?? 'download.zip' }
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.errors[0] ?? error.message
    if (error instanceof TypeError) return 'Không kết nối được máy chủ, vui lòng thử lại'
    return 'Có lỗi xảy ra, vui lòng thử lại'
}
