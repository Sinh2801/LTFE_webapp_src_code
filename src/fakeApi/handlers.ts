// Route fakeApi cho xác thực và hồ sơ (T07).
import { API_BASE } from '../libs/apiClient'
import type { UserRole } from '../libs/types'
import { loadDb, nextId, saveDb, type FakeDb } from './db'
import type { SeedUser } from './seed'
import { normalizeEmail, normalizeFullName, validateEmail, validateFullName, validatePassword } from '../libs/validation'

const LATENCY_MS = 300

export class HttpError extends Error {
    status: number
    errors: string[]

    constructor(status: number, message: string, errors: string[] = []) {
        super(message)
        this.name = 'HttpError'
        this.status = status
        this.errors = errors
    }
}

interface Ctx {
    params: Record<string, string>
    query: URLSearchParams
    body: unknown
    token: string | null
}

type Handler = (ctx: Ctx) => Promise<Response>

interface Route {
    method: string
    segments: string[]
    handler: Handler
}

const routes: Route[] = []

function add(method: string, path: string, handler: Handler): void {
    routes.push({ method, segments: path.split('/').filter(Boolean), handler })
}

function matchRoute(method: string, path: string): { route: Route; params: Record<string, string> } | null {
    const parts = path.split('/').filter(Boolean)
    for (const route of routes) {
        if (route.method !== method || route.segments.length !== parts.length) continue
        const params: Record<string, string> = {}
        let matched = true
        route.segments.forEach((segment, index) => {
            if (segment.startsWith(':')) params[segment.slice(1)] = decodeURIComponent(parts[index])
            else if (segment !== parts[index]) matched = false
        })
        if (matched) return { route, params }
    }
    return null
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    })
}

function success<T>(data: T, status = 200, message = 'Request successful'): Response {
    return json({ success: true, message, data }, status)
}

function failure(status: number, message: string, errors: string[] = []): Response {
    return json({ success: false, message, errors }, status)
}

//check login

export function requireUser(db: FakeDb, token: string | null): SeedUser {
    if (!token) throw new HttpError(401, 'Bạn cần đăng nhập để thực hiện thao tác này')
    const userId = db.sessions[token]
    const user = db.users.find((u) => u.id === userId)
    if (!user) throw new HttpError(401, 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
    return user
}
interface PublicUser {
    id: string
    fullName: string
    email: string
    role: UserRole
    createdAt: string
}

function publicUser(user: SeedUser): PublicUser {
    return { id: user.id, fullName: user.fullName, email: user.email, role: user.role, createdAt: user.createdAt }
}

function bodyObject(body: unknown): Record<string, unknown> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new HttpError(400, 'Dữ liệu gửi lên không hợp lệ')
    }
    return body as Record<string, unknown>
}

function assertValid(message: string | null): void {
    if (message) throw new HttpError(422, 'Dữ liệu không hợp lệ', [message])
}


async function hashPassword(salt: string, password: string): Promise<string> {
    const data = new TextEncoder().encode(`${salt}:${password}`)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

function newSalt(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')
}

async function verifyPassword(user: SeedUser, password: string): Promise<boolean> {
    return (await hashPassword(user.passwordSalt, password)) === user.passwordHash
}

function makeToken(): string {
    return `fake_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

//auth

add('POST', '/auth/register', async ({ body }) => {
    const input = bodyObject(body)
    assertValid(validateFullName(String(input.fullName ?? '')))
    assertValid(validateEmail(String(input.email ?? '')))
    assertValid(validatePassword(String(input.password ?? '')))

    const fullName = normalizeFullName(String(input.fullName))
    const email = normalizeEmail(String(input.email))
    const password = String(input.password)

    const db = loadDb()
    if (db.users.some((u) => u.email === email)) throw new HttpError(409, 'Email này đã được sử dụng')

    const passwordSalt = newSalt()
    const user: SeedUser = {
        id: nextId(db, 'u'),
        role: body && (body as { role?: string }).role === 'seller' ? 'seller' : 'buyer',
        fullName,
        email,
        passwordSalt,
        passwordHash: await hashPassword(passwordSalt, password),
        createdAt: new Date().toISOString(),
    }
    const token = makeToken()
    db.users.push(user)
    db.sessions[token] = user.id
    saveDb(db)
    return success({ user: publicUser(user), access_token: token }, 201, 'Register successful')
})

//ajax check
add('GET', '/auth/check-email', async ({ query }) => {
    const email = normalizeEmail(query.get('email') ?? '')
    assertValid(validateEmail(email))
    const db = loadDb()
    return success({ available: !db.users.some((u) => u.email === email) })
})

add('POST', '/auth/login', async ({ body }) => {
    const input = bodyObject(body)
    const email = typeof input.email === 'string' ? normalizeEmail(input.email) : ''
    const password = typeof input.password === 'string' ? input.password : ''

    const db = loadDb()
    const user = db.users.find((u) => u.email === email)
    if (!user || !(await verifyPassword(user, password))) {
        throw new HttpError(401, 'Email hoặc mật khẩu không đúng')
    }

    const token = makeToken()
    db.sessions[token] = user.id
    saveDb(db)
    return success({ user: publicUser(user), access_token: token }, 200, 'Login successful')
})

add('GET', '/auth/me', async ({ token }) => {
    const db = loadDb()
    return success(publicUser(requireUser(db, token)))
})

add('POST', '/auth/logout', async ({ token }) => {
    const db = loadDb()
    if (token) delete db.sessions[token]
    saveDb(db)
    return success(null, 200, 'Logout successful')
})

//profile

add('PUT', '/users/me', async ({ token, body }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    const input = bodyObject(body)
    assertValid(validateFullName(String(input.fullName ?? '')))
    user.fullName = normalizeFullName(String(input.fullName))
    saveDb(db)
    return success(publicUser(user), 200, 'Profile updated')
})

add('PUT', '/users/me/password', async ({ token, body }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    const input = bodyObject(body)
    const current = typeof input.currentPassword === 'string' ? input.currentPassword : ''
    if (!(await verifyPassword(user, current))) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Mật khẩu hiện tại không đúng'])
    }
    const newPassword = String(input.newPassword ?? '')
    assertValid(validatePassword(newPassword))
    user.passwordSalt = newSalt()
    user.passwordHash = await hashPassword(user.passwordSalt, newPassword)
    saveDb(db)
    return success(null, 200, 'Password updated')
})


export async function handleFakeRequest(url: URL, init?: RequestInit): Promise<Response> {
    const method = (init?.method ?? 'GET').toUpperCase()
    const path = url.pathname.slice(API_BASE.length) || '/'

    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS + Math.random() * 150))

    const headers = new Headers(init?.headers)
    const authorization = headers.get('Authorization') ?? ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null

    let body: unknown = undefined
    if (typeof init?.body === 'string' && init.body.length > 0) {
        try {
            body = JSON.parse(init.body)
        } catch {
            return failure(400, 'JSON không hợp lệ')
        }
    }

    const matched = matchRoute(method, path)
    if (!matched) return failure(404, `Không tìm thấy API: ${method} ${path}`)

    try {
        return await matched.route.handler({ params: matched.params, query: url.searchParams, body, token })
    } catch (error) {
        if (error instanceof HttpError) return failure(error.status, error.message, error.errors)
        console.error('[fake-api]', error)
        return failure(500, 'Lỗi máy chủ giả lập')
    }
}
