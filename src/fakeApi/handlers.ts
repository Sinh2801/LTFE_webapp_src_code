import { API_BASE } from '../libs/apiClient'
import type {UserRole, Order, Product, PaymentMethod, PaginatedResult, Review, ReviewSummary, LibraryItem, WarrantyTicket, WarrantyType,
} from '../libs/types'
import {loadDb as loadStoredDb, nextId, saveDb, type FakeDb, type StoredOrder, type StoredTicket, type FakeProduct} from './db'
import type { SeedUser } from './seed'
import { formatPrice, effectivePrice } from '../libs/format'
import {SEED_PRODUCTS, makeSeedReviews} from "./seed";
import { installGuideAsText } from '../libs/installGuide'
import {
    COMMENT_MAX, normalizeEmail, normalizeFullName, validateEmail, validateFullName, validatePassword, validateReview,
} from '../libs/validation'
import {
    DAY_MS, WARRANTY_DAYS, WARRANTY_DESC_MAX, WARRANTY_DESC_MIN, WARRANTY_TYPES,
} from '../libs/warranty'
import { createZip } from './zip'

const LATENCY_MS = 300
export const PAY_DELAY_MS = 2500
const TICKET_PROCESS_MS = 6000
const TICKET_RESOLVE_MS = 20000

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

function loadDb(): FakeDb {
    const db = loadStoredDb()
    if (!Array.isArray(db.reviews)) db.reviews = makeSeedReviews()
    if (!Array.isArray(db.downloads)) db.downloads = []
    if (!Array.isArray(db.tickets)) db.tickets = []
    return db
}

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

function normalizeText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .toLowerCase()
        .trim()
}

function publicProduct(db: FakeDb, product: FakeProduct): Product {
    const result = { ...product }
    delete result.previewFileId
    delete result.sourceFileId
    delete result.sourceFileName
    delete result.sourceFileSize
    const reviews = db.reviews.filter((review) => review.productId === product.id)
    if (reviews.length > 0) {
        result.reviewCount = reviews.length
        result.rating = Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
    }
    result.downloads = product.downloads + db.downloads.filter((log) => log.productId === product.id).length
    return result
}

function queryNumber(query: URLSearchParams, key: string, fallback: number): number {
    const raw = query.get(key)
    if (raw === null || raw.trim() === '') return fallback
    const value = Number(raw)
    if (!Number.isInteger(value) || value < 1) {
        throw new HttpError(422, `Tham số ${key} không hợp lệ`)
    }
    return value
}

function optionalPrice(query: URLSearchParams, key: string): number | undefined {
    const raw = query.get(key)
    if (raw === null || raw.trim() === '') return undefined
    const value = Number(raw)
    if (!Number.isFinite(value) || value < 0) {
        throw new HttpError(422, 'Khoảng giá không hợp lệ')
    }
    return value
}

function productPrice(product: Product): number {
    return product.salePrice ?? product.price
}

add('GET', '/categories', async () => {
    const db = loadDb()
    return success(db.categories.map((category) => ({
        ...category,
        productCount: db.products.filter((product) =>
            product.status === 'approved' && (product.categoryId === category.id || normalizeText(product.category) === normalizeText(category.name)),
        ).length,
    })))
})

add('GET', '/products', async ({ query }) => {
    const db = loadDb()
    const page = queryNumber(query, 'page', 1)
    const limit = Math.min(queryNumber(query, 'limit', 9), 100)
    const keyword = normalizeText(query.get('q') ?? '')
    const categoryValue = query.get('category')
    const categoryText = categoryValue ? normalizeText(categoryValue) : ''
    const category = categoryValue
        ? db.categories.find((item) => [item.id, item.slug, item.name].some((value) => normalizeText(value) === categoryText))
        : undefined
    const tech = normalizeText(query.get('tech') ?? '')
    const minPrice = optionalPrice(query, 'minPrice')
    const maxPrice = optionalPrice(query, 'maxPrice')
    const featuredValue = query.get('featured')
    if (featuredValue !== null && featuredValue !== 'true' && featuredValue !== 'false') {
        throw new HttpError(422, 'Tham số featured không hợp lệ')
    }
    const sort = query.get('sort') ?? 'newest'
    const validSorts = ['newest', 'popular', 'best-selling', 'rating', 'price_asc', 'price_desc', 'price-asc', 'price-desc', 'name_asc']
    if (!validSorts.includes(sort)) throw new HttpError(422, 'Cách sắp xếp không hợp lệ')

    let products = db.products.filter((product) => product.status === 'approved').map((product) => publicProduct(db, product))
    if (keyword) {
        products = products.filter((product) => {
            const content = [product.title, product.description, product.code, product.category, ...product.features, ...product.technologies]
                .map(normalizeText)
                .join(' ')
            return content.includes(keyword)
        })
    }
    if (categoryValue) {
        products = products.filter((product) => category
            ? product.categoryId === category.id || normalizeText(product.category) === normalizeText(category.name)
            : normalizeText(product.categoryId ?? '') === categoryText || normalizeText(product.category) === categoryText)
    }
    if (tech) {
        products = products.filter((product) => product.technologies.some((item) => normalizeText(item).includes(tech)))
    }
    if (minPrice !== undefined) products = products.filter((product) => productPrice(product) >= minPrice)
    if (maxPrice !== undefined) products = products.filter((product) => productPrice(product) <= maxPrice)
    if (featuredValue !== null) {
        const featured = featuredValue === 'true'
        products = products.filter((product) => Boolean(product.featured) === featured)
    }

    const comparators: Record<string, (a: Product, b: Product) => number> = {
        newest: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
        popular: (a, b) => b.downloads - a.downloads,
        'best-selling': (a, b) => b.downloads - a.downloads,
        rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
        price_asc: (a, b) => productPrice(a) - productPrice(b),
        'price-asc': (a, b) => productPrice(a) - productPrice(b),
        price_desc: (a, b) => productPrice(b) - productPrice(a),
        'price-desc': (a, b) => productPrice(b) - productPrice(a),
        name_asc: (a, b) => normalizeText(a.title).localeCompare(normalizeText(b.title)),
    }
    products.sort(comparators[sort])

    const total = products.length
    const result: PaginatedResult<Product> = {
        items: products.slice((page - 1) * limit, page * limit),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    }
    return success(result)
})

add('GET', '/products/:id', async ({ params }) => {
    const db = loadDb()
    const product = db.products.find((item) => item.id === params.id && item.status === 'approved')
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    return success(publicProduct(db, product))
})

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
        role: 'buyer',
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

add('GET', '/orders/:id', async ({ params, token }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    const order = db.orders.find((o) => o.id === params.id)
    if (!order) throw new HttpError(404, 'Đơn hàng không tồn tại')
    if (order.userId !== user.id) throw new HttpError(403, 'Bạn không có quyền xem đơn hàng này')
    resolvePayment(order)
    saveDb(db)
    return success(toPublicOrder(order))
})

add('GET', '/orders', async ({ token }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    db.orders.forEach(resolvePayment)
    saveDb(db)
    const orders = db.orders
        .filter((order) => order.userId === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return success(orders.map(toPublicOrder))
})

function resolvePayment(order: StoredOrder): void {
    if (order.status !== 'pending' || !order.payResolveAt || Date.now() < order.payResolveAt) return
    order.status = order.payOutcome ?? 'failed'
    order.paidAt = order.status === 'paid' ? new Date().toISOString() : null
    order.payResolveAt = null
    order.payOutcome = null
}

add('POST', '/orders', async ({ token, body }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    settleAll(db)
    const input = bodyObject(body)
    const ids = Array.isArray(input.productIds) ? input.productIds.filter((id): id is string => typeof id === 'string') : []
    if (ids.length === 0) throw new HttpError(400, 'Giỏ hàng đang trống')
    if (new Set(ids).size !== ids.length) throw new HttpError(422, 'Danh sách sản phẩm có trùng lặp')

    const items = ids.map((id) => {
        const product = findProduct(id)
        if (hasPurchased(db, user.id, id)) {
            throw new HttpError(409, `Bạn đã sở hữu "${product.title}"`)
        }
        return {
            productId: product.id,
            title: product.title,
            price: effectivePrice(product),
            thumbnail: product.thumbnail,
        }
    })
    const total = items.reduce((sum, item) => sum + item.price, 0)

    const order: StoredOrder = {
        id: nextId(db, 'o'),
        userId: user.id,
        items,
        total,
        status: 'pending',
        paymentMethod: null,
        createdAt: new Date().toISOString(),
        paidAt: null,
        payOutcome: null,
        payResolveAt: null,
    }
    db.orders.push(order)
    saveDb(db)
    return success(toPublicOrder(order), 201, `Đơn hàng có tổng ${formatPrice(total)}`)
})

add('POST', '/orders/:id/pay', async ({ params, token, body }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    settleAll(db)
    const input = bodyObject(body)
    const method = input.method
    if (method !== 'card' && method !== 'wallet') {
        throw new HttpError(400, 'Phương thức thanh toán không hợp lệ')
    }
    const order = db.orders.find((o) => o.id === params.id)
    if (!order) throw new HttpError(404, 'Đơn hàng không tồn tại')
    if (order.userId !== user.id) throw new HttpError(403, 'Bạn không có quyền thanh toán đơn hàng này')
    if (order.status === 'paid') throw new HttpError(409, 'Đơn hàng đã được thanh toán')

    const alreadyOwned = order.items.find((item) => hasPurchased(db, user.id, item.productId))
    if (alreadyOwned) throw new HttpError(409, `Bạn đã sở hữu "${alreadyOwned.title}"`)

    const paymentMethod: PaymentMethod = method
    order.status = 'pending'
    order.paymentMethod = paymentMethod
    order.payOutcome = paymentMethod === 'wallet' ? 'failed' : 'paid'
    order.payResolveAt = Date.now() + PAY_DELAY_MS
    order.paidAt = null
    saveDb(db)
    return success(toPublicOrder(order), 202, 'Đang xử lý thanh toán')
})
function optionalUser(db: FakeDb, token: string | null): SeedUser | null {
    if (!token) return null
    return db.users.find((u) => u.id === db.sessions[token]) ?? null
}
function settleAll(db: FakeDb): void {
    const before = JSON.stringify([db.orders, db.tickets])
    db.orders.forEach(resolvePayment)
    const now = Date.now()
    for (const ticket of db.tickets) {
        if (ticket.status === 'resolved') continue
        if (ticket.resolveAt && now >= ticket.resolveAt) {
            ticket.status = 'resolved'
            ticket.reply = ticketReply(ticket.type)
            ticket.updatedAt = new Date().toISOString()
            ticket.processAt = null
            ticket.resolveAt = null
        } else if (ticket.status === 'open' && ticket.processAt && now >= ticket.processAt) {
            ticket.status = 'processing'
            ticket.updatedAt = new Date().toISOString()
            ticket.processAt = null
        }
    }
    if (JSON.stringify([db.orders, db.tickets]) !== before) saveDb(db)
}

function ticketReply(type: WarrantyType): string {
    if (type === 'bug') return 'Chúng tôi đã tái hiện và vá lỗi bạn báo cáo. Hãy tải lại gói mã nguồn trong Hồ sơ → Mã nguồn đã mua, xóa thư mục node_modules rồi chạy lại npm install.'
    if (type === 'install') return 'Bạn hãy kiểm tra phiên bản Node.js (từ 18 trở lên), xóa node_modules và package-lock.json, chạy npm install rồi npm run dev. Nếu vẫn lỗi, hãy gửi thêm ảnh chụp terminal để được hỗ trợ tiếp.'
    return 'Cảm ơn bạn đã liên hệ. Giấy phép đi kèm cho phép sử dụng trong dự án của bạn, chi tiết xem tại trang Chính sách.'
}

function paidOrderOf(db: FakeDb, userId: string, productId: string): StoredOrder | undefined {
    return db.orders.find(
        (o) => o.userId === userId && o.status === 'paid' && o.items.some((i) => i.productId === productId),
    )
}

function productOrSeed(db: FakeDb, id: string): FakeProduct | undefined {
    return db.products.find((p) => p.id === id) ?? (SEED_PRODUCTS.find((p) => p.id === id) as FakeProduct | undefined)
}
function buildReviewSummary(db: FakeDb, productId: string, userId: string | null): ReviewSummary {
    const items = db.reviews
        .filter((r) => r.productId === productId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const distribution: ReviewSummary['distribution'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const review of items) distribution[review.rating as 1 | 2 | 3 | 4 | 5] += 1
    const average = items.length
        ? Math.round((items.reduce((sum, r) => sum + r.rating, 0) / items.length) * 10) / 10
        : 0
    return { items, average, count: items.length, distribution, mine: userId ? items.find((r) => r.userId === userId) ?? null : null }
}

add('GET', '/products/:id/reviews', async ({ params, token }) => {
    const db = loadDb()
    const product = db.products.find((p) => p.id === params.id && p.status === 'approved')
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    return success(buildReviewSummary(db, product.id, optionalUser(db, token)?.id ?? null))
})

function parseReviewBody(body: unknown): { rating: number; comment: string } {
    const input = bodyObject(body)
    const rating = Number(input.rating)
    const comment = typeof input.comment === 'string' ? input.comment.trim().replace(/\s+\n/g, '\n') : ''
    assertValid(validateReview(rating, comment))
    return { rating, comment: comment.slice(0, COMMENT_MAX) }
}

add('POST', '/products/:id/reviews', async ({ params, token, body }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    settleAll(db)
    const product = db.products.find((p) => p.id === params.id && p.status === 'approved')
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    if (!paidOrderOf(db, user.id, product.id)) {
        throw new HttpError(403, 'Chỉ khách hàng đã mua và thanh toán thành công mới được đánh giá sản phẩm')
    }
    if (db.reviews.some((r) => r.productId === product.id && r.userId === user.id)) {
        throw new HttpError(409, 'Bạn đã đánh giá sản phẩm này, hãy chỉnh sửa đánh giá hiện có')
    }
    const { rating, comment } = parseReviewBody(body)
    const review: Review = {
        id: nextId(db, 'rv'),
        productId: product.id,
        userId: user.id,
        userName: user.fullName,
        rating,
        comment,
        createdAt: new Date().toISOString(),
    }
    db.reviews.push(review)
    saveDb(db)
    return success(review, 201, 'Cảm ơn bạn đã đánh giá')
})

add('PUT', '/reviews/:id', async ({ params, token, body }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    const review = db.reviews.find((r) => r.id === params.id)
    if (!review) throw new HttpError(404, 'Không tìm thấy đánh giá')
    if (review.userId !== user.id) throw new HttpError(403, 'Bạn chỉ được sửa đánh giá của chính mình')
    const { rating, comment } = parseReviewBody(body)
    review.rating = rating
    review.comment = comment
    review.updatedAt = new Date().toISOString()
    saveDb(db)
    return success(review, 200, 'Đã cập nhật đánh giá')
})
add('GET', '/library', async ({ token }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    settleAll(db)
    const items: LibraryItem[] = []
    const paid = db.orders
        .filter((o) => o.userId === user.id && o.status === 'paid' && o.paidAt)
        .sort((a, b) => (b.paidAt ?? '').localeCompare(a.paidAt ?? ''))
    for (const order of paid) {
        for (const item of order.items) {
            const product = productOrSeed(db, item.productId)
            if (!product || items.some((x) => x.id === product.id)) continue
            const logs = db.downloads
                .filter((log) => log.userId === user.id && log.productId === product.id)
                .sort((a, b) => b.at.localeCompare(a.at))
            items.push({
                ...publicProduct(db, product),
                orderId: order.id,
                purchasedAt: order.paidAt as string,
                downloadCount: logs.length,
                lastDownloadedAt: logs[0]?.at ?? null,
                warrantyExpiresAt: new Date(new Date(order.paidAt as string).getTime() + WARRANTY_DAYS * DAY_MS).toISOString(),
            })
        }
    }
    return success(items)
})

add('GET', '/products/:id/download', async ({ params, token }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    settleAll(db)
    const product = productOrSeed(db, params.id)
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    // mua một lần, tải lại không giới hạn: chỉ cần đã có đơn paid chứa sản phẩm
    if (!paidOrderOf(db, user.id, product.id)) {
        throw new HttpError(403, 'Bạn cần mua sản phẩm này và thanh toán thành công trước khi tải mã nguồn')
    }
    const filename = `${product.id}-v${product.version}.zip`
    const blob = createZip([
        { name: 'README.md', content: installGuideAsText(product) },
        { name: 'LICENSE.txt', content: `Giấy phép: ${product.license}\nMã sản phẩm: ${product.code}\nNgười mua: ${user.email}\n` },
        { name: 'package.json', content: JSON.stringify({ name: product.id, version: product.version, private: true }, null, 2) },
        { name: 'src/index.ts', content: `// Mã nguồn mẫu của "${product.title}"\nconsole.log('Xin chào từ ${product.code}')\n` },
    ])
    db.downloads.push({ id: nextId(db, 'dl'), userId: user.id, productId: product.id, at: new Date().toISOString() })
    saveDb(db)
    return new Response(blob, {
        status: 200,
        headers: { 'Content-Type': 'application/zip', 'Content-Disposition': `attachment; filename="${filename}"` },
    })
})
function publicTicket(ticket: StoredTicket): WarrantyTicket {
    return {
        id: ticket.id, userId: ticket.userId, productId: ticket.productId, productTitle: ticket.productTitle,
        orderId: ticket.orderId, type: ticket.type, description: ticket.description, status: ticket.status,
        reply: ticket.reply, createdAt: ticket.createdAt, updatedAt: ticket.updatedAt,
    }
}

add('GET', '/warranty-requests', async ({ token }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    settleAll(db)
    const tickets = db.tickets
        .filter((t) => t.userId === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return success(tickets.map(publicTicket))
})

add('POST', '/warranty-requests', async ({ token, body }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    settleAll(db)
    const input = bodyObject(body)
    const productId = typeof input.productId === 'string' ? input.productId : ''
    const type = input.type as WarrantyType
    const description = typeof input.description === 'string' ? input.description.trim() : ''
    if (!WARRANTY_TYPES.some((item) => item.value === type)) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Loại yêu cầu bảo hành không hợp lệ'])
    }
    if (description.length < WARRANTY_DESC_MIN || description.length > WARRANTY_DESC_MAX) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', [`Mô tả vấn đề từ ${WARRANTY_DESC_MIN} đến ${WARRANTY_DESC_MAX} ký tự`])
    }
    const product = productOrSeed(db, productId)
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    const order = paidOrderOf(db, user.id, product.id)
    if (!order || !order.paidAt) {
        throw new HttpError(403, 'Chỉ khách hàng đã mua sản phẩm mới được gửi yêu cầu bảo hành')
    }
    if (new Date(order.paidAt).getTime() + WARRANTY_DAYS * DAY_MS <= Date.now()) {
        throw new HttpError(422, 'Sản phẩm đã hết hạn bảo hành', [`Thời hạn bảo hành là ${WARRANTY_DAYS} ngày kể từ ngày thanh toán`])
    }
    if (db.tickets.some((t) => t.userId === user.id && t.productId === product.id && t.status !== 'resolved')) {
        throw new HttpError(409, 'Bạn đang có một yêu cầu bảo hành chưa hoàn tất cho sản phẩm này')
    }
    const now = Date.now()
    const ticket: StoredTicket = {
        id: nextId(db, 'wr'),
        userId: user.id,
        productId: product.id,
        productTitle: product.title,
        orderId: order.id,
        type,
        description,
        status: 'open',
        reply: null,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
        processAt: now + TICKET_PROCESS_MS,
        resolveAt: now + TICKET_RESOLVE_MS,
    }
    db.tickets.push(ticket)
    saveDb(db)
    return success(publicTicket(ticket), 201, 'Đã tiếp nhận yêu cầu bảo hành')
})

export function toPublicOrder(order: StoredOrder): Order {
    return {
        id: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
    }
}

function hasPurchased(db: FakeDb, userId: string, productId: string): boolean {
    return db.orders.some(
        (o) => o.userId === userId && o.status === 'paid' && o.items.some((i) => i.productId === productId),
    )
}

function findProduct(id: string): Product {
    const product = SEED_PRODUCTS.find((p) => p.id === id && p.status === 'approved')
    if (!product) throw new HttpError(404, 'Sản phẩm không tồn tại')
    return product
}

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
