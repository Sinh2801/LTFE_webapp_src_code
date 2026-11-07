// Route fakeApi cho xác thực và hồ sơ (T07).
import { API_BASE } from '../libs/apiClient'
import type { Category, Product, ProductStatus, UserRole } from '../libs/types'
import { loadDb, nextId, saveDb, type FakeDb } from './db'
import { deleteProductFile, productPreviewUrl, saveProductFile } from './fileStore'
import type { SeedUser } from './seed'

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
    routes.push({
            method, segments: path.split('/').filter(Boolean), handler
        })
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
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role ?? 'user',
        createdAt: user.createdAt,
    }
}

function requireAdmin(db: FakeDb, token: string | null): SeedUser {
    const user = requireUser(db, token)
    if (user.role !== 'admin') throw new HttpError(403, 'Bạn không có quyền thực hiện thao tác này')
    return user
}

function requireSeller(db: FakeDb, token: string | null): SeedUser {
    const user = requireUser(db, token)
    if (user.role !== 'seller' && user.role !== 'admin') {
        throw new HttpError(403, 'Tài khoản chưa được cấp quyền người bán')
    }
    return user
}

function requireProductOwner(db: FakeDb, productId: string, token: string | null) {
    const user = requireUser(db, token)
    const product = db.products.find((item) => item.id === productId)
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    if (product.sellerId !== user.id && user.role !== 'admin') {
        throw new HttpError(403, 'Bạn không sở hữu sản phẩm này')
    }
    return product
}

function getUploadFile(body: unknown): File {
    if (!(body instanceof FormData)) throw new HttpError(400, 'Dữ liệu upload không hợp lệ')
    const file = body.get('file')
    if (!(file instanceof File) || file.size === 0) throw new HttpError(422, 'Vui lòng chọn file')
    return file
}

function validatePreviewFile(file: File): void {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        throw new HttpError(422, 'Chỉ nhận ảnh JPG, PNG hoặc WEBP')
    }
    if (file.size > 5 * 1024 * 1024) throw new HttpError(422, 'Ảnh không được lớn hơn 5 MB')
}

function validateZipFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.zip')) throw new HttpError(422, 'File source phải có định dạng .zip')
    const allowedTypes = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream']
    if (file.type && !allowedTypes.includes(file.type)) throw new HttpError(422, 'File source không đúng định dạng ZIP')
    if (file.size > 25 * 1024 * 1024) throw new HttpError(422, 'File ZIP không được lớn hơn 25 MB')
}

async function publicProduct(product: FakeDb['products'][number]): Promise<Product> {
    const { previewFileId, ...data } = product
    delete data.sourceFileId
    delete data.sourceFileName
    delete data.sourceFileSize
    if (!previewFileId) return data

    const thumbnail = await productPreviewUrl(previewFileId)
    return thumbnail ? { ...data, thumbnail } : data
}

function bodyObject(body: unknown): Record<string, unknown> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new HttpError(400, 'Dữ liệu gửi lên không hợp lệ')
    }
    return body as Record<string, unknown>
}

function validateFullName(name: unknown): string {
    const value = typeof name === 'string' ? name.trim() : ''
    if (value.length < 2)
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Họ tên phải có ít nhất 2 ký tự'])
    return value
}

function validatePassword(password: unknown): string {
    if (typeof password !== 'string' || password.length < 8) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Mật khẩu phải có ít nhất 8 ký tự'])
    }
    return password
}

function validateEmail(email: unknown): string {
    const value = typeof email === 'string' ? email.trim().toLowerCase() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Email không đúng định dạng'])
    }
    return value
}

function makeToken(): string {
    return `fake_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

//auth

add('POST', '/auth/register', async ({ body }) => {
    const input = bodyObject(body)
    const fullName = validateFullName(input.fullName)
    const email = validateEmail(input.email)
    const password = validatePassword(input.password)

    const db = loadDb()
    if (db.users.some((u) => u.email === email)) throw new HttpError(409, 'Email đã được sử dụng')

    const user: SeedUser = {
        id: nextId(db, 'u'),
        fullName,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
    }
    const token = makeToken()
    db.users.push(user)
    db.sessions[token] = user.id
    saveDb(db)
    return success({ user: publicUser(user), access_token: token }, 201, 'Register successful')
})

add('POST', '/auth/login', async ({ body }) => {
    const input = bodyObject(body)
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
    const password = typeof input.password === 'string' ? input.password : ''

    const db = loadDb()
    const user = db.users.find((u) => u.email === email && u.password === password)
    if (!user) throw new HttpError(401, 'Email hoặc mật khẩu không đúng')

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
    user.fullName = validateFullName(input.fullName)
    saveDb(db)
    return success(publicUser(user), 200, 'Profile updated')
})

add('PUT', '/users/me/password', async ({ token, body }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    const input = bodyObject(body)
    if (input.currentPassword !== user.password) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Mật khẩu hiện tại không đúng'])
    }
    user.password = validatePassword(input.newPassword)
    saveDb(db)
    return success(null, 200, 'Password updated')
})

const PRODUCT_STATUSES: ProductStatus[] = ['pending', 'approved', 'rejected', 'hidden']

function optionalText(value: unknown, field: string, maxLength = 500): string | undefined {
    if (value === undefined || value === null || value === '') return undefined
    if (typeof value !== 'string' || value.length > maxLength) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', [`${field} không hợp lệ`])
    }
    return value.trim()
}

function requiredText(value: unknown, field: string, maxLength: number): string {
    const text = optionalText(value, field, maxLength)
    if (!text) throw new HttpError(422, 'Dữ liệu không hợp lệ', [`${field} là bắt buộc`])
    return text
}

function validatedProductFields(input: Record<string, unknown>, current?: Product) {
    const title = requiredText(input.title ?? current?.title, 'Tên sản phẩm', 200)
    const description = requiredText(input.description ?? current?.description, 'Mô tả', 5000)
    const category = requiredText(input.category ?? current?.category, 'Danh mục', 100)
    const priceValue = input.price ?? current?.price
    const price = typeof priceValue === 'number' ? priceValue : Number(priceValue)
    if (!Number.isFinite(price) || price < 0) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Giá phải là số không âm'])
    }

    const saleValue = input.salePrice ?? current?.salePrice
    const salePrice = saleValue === undefined ? undefined : Number(saleValue)
    if (salePrice !== undefined && (!Number.isFinite(salePrice) || salePrice < 0 || salePrice > price)) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Giá khuyến mãi phải từ 0 đến giá gốc'])
    }

    const technologyValue = input.technologies ?? current?.technologies ?? []
    if (!Array.isArray(technologyValue) || technologyValue.some((item) => typeof item !== 'string')) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Danh sách công nghệ không hợp lệ'])
    }

    return {
        title,
        description,
        category,
        price,
        salePrice,
        technologies: technologyValue.map((item: string) => item.trim()).filter(Boolean),
        version: optionalText(input.version ?? current?.version, 'Phiên bản', 50),
        license: optionalText(input.license ?? current?.license, 'License', 100),
        demoUrl: optionalText(input.demoUrl ?? current?.demoUrl, 'Link demo', 1000),
        thumbnail: optionalText(input.thumbnail ?? current?.thumbnail, 'Ảnh xem trước', 1000),
    }
}

function categorySlug(name: string): string {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

function validatedCategory(input: Record<string, unknown>, current?: Category) {
    const name = requiredText(input.name ?? current?.name, 'Tên danh mục', 100)
    const description = optionalText(input.description ?? current?.description, 'Mô tả', 1000)
    const slugInput = input.slug ?? current?.slug
    const slug = optionalText(slugInput, 'Slug', 120) ?? categorySlug(name)
    return { name, slug, description }
}

add('GET', '/products', async ({ query }) => {
    const db = loadDb()
    const page = Math.max(1, Number.parseInt(query.get('page') ?? '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, Number.parseInt(query.get('limit') ?? '10', 10) || 10))
    const keyword = (query.get('keyword') ?? '').trim().toLocaleLowerCase('vi')
    const category = (query.get('category') ?? '').trim().toLocaleLowerCase('vi')
    const technology = (query.get('technology') ?? '').trim().toLocaleLowerCase('vi')
    const minPrice = query.has('minPrice') ? Number(query.get('minPrice')) : undefined
    const maxPrice = query.has('maxPrice') ? Number(query.get('maxPrice')) : undefined

    if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['minPrice không hợp lệ'])
    }
    if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['maxPrice không hợp lệ'])
    }

    const filtered = db.products
        .filter((product) => product.status === 'approved')
        .filter((product) => {
            const searchable = [product.title, product.description, product.category, ...product.technologies]
                .join(' ')
                .toLocaleLowerCase('vi')
            const productPrice = product.salePrice ?? product.price
            return (!keyword || searchable.includes(keyword))
                && (!category || product.category.toLocaleLowerCase('vi') === category)
                && (!technology || product.technologies.some((item) => item.toLocaleLowerCase('vi') === technology))
                && (minPrice === undefined || productPrice >= minPrice)
                && (maxPrice === undefined || productPrice <= maxPrice)
        })

    const sort = query.get('sort')
    if (sort === 'price-asc') filtered.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
    else if (sort === 'price-desc') filtered.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
    else if (sort === 'popular') filtered.sort((a, b) => b.downloads - a.downloads)
    else filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const items = await Promise.all(filtered.slice((page - 1) * limit, page * limit).map(publicProduct))
    return success({ items, pagination: { page, limit, total, totalPages } })
})

add('GET', '/products/:id', async ({ params }) => {
    const db = loadDb()
    const product = db.products.find((item) => item.id === params.id && item.status === 'approved')
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    return success(await publicProduct(product))
})

add('POST', '/products', async ({ body, token }) => {
    const db = loadDb()
    const user = requireSeller(db, token)
    const input = bodyObject(body)
    const fields = validatedProductFields(input)
    if (!db.categories.some((category) => category.name === fields.category)) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Danh mục không tồn tại'])
    }
    const id = nextId(db, 'product')
    const product: Product = {
        id,
        code: `SRC-${id.toUpperCase()}`,
        ...fields,
        sellerId: user.id,
        sellerName: user.fullName,
        downloads: 0,
        status: 'pending',
        createdAt: new Date().toISOString(),
    }
    db.products.push(product)
    saveDb(db)
    return success(product, 201, 'Product created and awaiting review')
})

add('PUT', '/products/:id', async ({ params, body, token }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    const product = db.products.find((item) => item.id === params.id)
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    if (product.sellerId !== user.id) throw new HttpError(403, 'Bạn không sở hữu sản phẩm này')

    const fields = validatedProductFields({ ...product, ...bodyObject(body) }, product)
    if (!db.categories.some((category) => category.name === fields.category)) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Danh mục không tồn tại'])
    }
    Object.assign(product, fields, { updatedAt: new Date().toISOString() })
    saveDb(db)
    return success(product, 200, 'Product updated')
})

add('DELETE', '/products/:id', async ({ params, token }) => {
    const db = loadDb()
    const user = requireUser(db, token)
    const index = db.products.findIndex((item) => item.id === params.id)
    if (index < 0) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    if (db.products[index].sellerId !== user.id && user.role !== 'admin') {
        throw new HttpError(403, 'Bạn không sở hữu sản phẩm này')
    }
    await deleteProductFile(db.products[index].previewFileId)
    await deleteProductFile(db.products[index].sourceFileId)
    db.products.splice(index, 1)
    saveDb(db)
    return success(null, 200, 'Product deleted')
})

add('POST', '/products/:id/preview', async ({ params, body, token }) => {
    const db = loadDb()
    const product = requireProductOwner(db, params.id, token)
    const file = getUploadFile(body)
    validatePreviewFile(file)
    const stored = await saveProductFile(product.id, 'preview', file)
    await deleteProductFile(product.previewFileId)
    product.previewFileId = stored.id
    product.thumbnail = undefined
    product.updatedAt = new Date().toISOString()
    saveDb(db)
    return success({ product: await publicProduct(product), fileName: stored.name, size: stored.size }, 201, 'Preview uploaded')
})

add('POST', '/products/:id/source', async ({ params, body, token }) => {
    const db = loadDb()
    const product = requireProductOwner(db, params.id, token)
    const file = getUploadFile(body)
    validateZipFile(file)
    const stored = await saveProductFile(product.id, 'source', file)
    await deleteProductFile(product.sourceFileId)
    product.sourceFileId = stored.id
    product.sourceFileName = stored.name
    product.sourceFileSize = stored.size
    product.updatedAt = new Date().toISOString()
    saveDb(db)
    return success({ productId: product.id, fileName: stored.name, size: stored.size }, 201, 'Source uploaded')
})

add('PATCH', '/products/:id/status', async ({ params, body, token }) => {
    const db = loadDb()
    requireAdmin(db, token)
    const product = db.products.find((item) => item.id === params.id)
    if (!product) throw new HttpError(404, 'Không tìm thấy sản phẩm')
    const status = bodyObject(body).status
    if (typeof status !== 'string' || !PRODUCT_STATUSES.includes(status as ProductStatus)) {
        throw new HttpError(422, 'Dữ liệu không hợp lệ', ['Trạng thái sản phẩm không hợp lệ'])
    }
    product.status = status as ProductStatus
    product.updatedAt = new Date().toISOString()
    saveDb(db)
    return success(product, 200, 'Product status updated')
})

add('GET', '/categories', async () => success(loadDb().categories))

add('POST', '/categories', async ({ body, token }) => {
    const db = loadDb()
    requireAdmin(db, token)
    const fields = validatedCategory(bodyObject(body))
    if (db.categories.some((item) => item.name.toLocaleLowerCase('vi') === fields.name.toLocaleLowerCase('vi') || item.slug === fields.slug)) {
        throw new HttpError(409, 'Tên hoặc slug danh mục đã tồn tại')
    }
    const category: Category = {
        id: nextId(db, 'category'),
        ...fields,
        createdAt: new Date().toISOString(),
    }
    db.categories.push(category)
    saveDb(db)
    return success(category, 201, 'Category created')
})

add('PUT', '/categories/:id', async ({ params, body, token }) => {
    const db = loadDb()
    requireAdmin(db, token)
    const category = db.categories.find((item) => item.id === params.id)
    if (!category) throw new HttpError(404, 'Không tìm thấy danh mục')
    const fields = validatedCategory(bodyObject(body), category)
    if (db.categories.some((item) => item.id !== category.id && (item.name.toLocaleLowerCase('vi') === fields.name.toLocaleLowerCase('vi') || item.slug === fields.slug))) {
        throw new HttpError(409, 'Tên hoặc slug danh mục đã tồn tại')
    }
    const previousName = category.name
    Object.assign(category, fields, { updatedAt: new Date().toISOString() })
    if (previousName !== category.name) {
        db.products.forEach((product) => {
            if (product.category === previousName) {
                product.category = category.name
                product.updatedAt = new Date().toISOString()
            }
        })
    }
    saveDb(db)
    return success(category, 200, 'Category updated')
})

add('DELETE', '/categories/:id', async ({ params, token }) => {
    const db = loadDb()
    requireAdmin(db, token)
    const category = db.categories.find((item) => item.id === params.id)
    if (!category) throw new HttpError(404, 'Không tìm thấy danh mục')
    if (db.products.some((product) => product.category === category.name)) {
        throw new HttpError(409, 'Không thể xóa danh mục đang có sản phẩm')
    }
    db.categories = db.categories.filter((item) => item.id !== params.id)
    saveDb(db)
    return success(null, 200, 'Category deleted')
})


export async function handleFakeRequest(url: URL, init?: RequestInit): Promise<Response> {
    const method = (init?.method ?? 'GET').toUpperCase()
    const path = url.pathname.slice(API_BASE.length) || '/'

    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS + Math.random() * 150))

    const headers = new Headers(init?.headers)
    const authorization = headers.get('Authorization') ?? ''
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null

    let body: unknown = typeof FormData !== 'undefined' && init?.body instanceof FormData ? init.body : undefined
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
