import type { Category, Product, Order, OrderStatus, PaymentMethod } from '../libs/types'
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_USERS, SEED_ORDERS ,type SeedUser } from './seed'

const DB_KEY = 'fakeDb'
const DB_VERSION = 21

export interface FakeProduct extends Product {
    previewFileId?: string
    sourceFileId?: string
    sourceFileName?: string
    sourceFileSize?: number
}

export interface StoredOrder {
    id: string
    userId: string
    items: Order['items']
    total: number
    status: OrderStatus
    paymentMethod: PaymentMethod | null
    createdAt: string
    paidAt: string | null
    payOutcome: 'paid' | 'failed' | null
    payResolveAt: number | null
}

export interface FakeDb {
    version: number
    seq: number
    users: SeedUser[]
    sessions: Record<string, string>
    products: FakeProduct[]
    orders: StoredOrder[]
    categories: Category[]
}

function seedDb(): FakeDb {
    return {
        version: DB_VERSION,
        seq: 100,
        users: SEED_USERS.map((u) => ({ ...u })),
        sessions: {},
        products: SEED_PRODUCTS.map((p: Product) => ({ ...p })),
        orders: SEED_ORDERS.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })), payOutcome: null, payResolveAt: null })),
        categories: SEED_CATEGORIES.map((c: Category) => ({ ...c })),
    }
}

export function saveDb(db: FakeDb): void {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db))
    } catch {
    }
}

export function loadDb(): FakeDb {
    let db: FakeDb | null = null
    try {
        const raw = localStorage.getItem(DB_KEY)
        if (raw) {
            const parsed = JSON.parse(raw) as Partial<FakeDb>
            if (parsed.version === DB_VERSION) {
                db = {
                    version: DB_VERSION,
                    seq: typeof parsed.seq === 'number' ? parsed.seq : 100,
                    users: Array.isArray(parsed.users) ? parsed.users : [],
                    orders: Array.isArray(parsed.orders) ? parsed.orders : [],
                    sessions: parsed.sessions && typeof parsed.sessions === 'object' ? parsed.sessions : {},
                    products: Array.isArray(parsed.products) ? parsed.products : SEED_PRODUCTS.map((p: Product) => ({ ...p })),
                    categories: Array.isArray(parsed.categories)
                        ? parsed.categories
                        : SEED_CATEGORIES.map((c: Category) => ({ ...c }))
                }
                const existing = new Set(db.users.map((u) => u.email.toLowerCase()))
                let changed = false
                for (const user of db.users) {
                    const legacyUser = user as SeedUser & { role: string }
                    if (legacyUser.role !== 'buyer') {
                        user.role = 'buyer'
                        changed = true
                    }
                }
                for (const product of db.products) {
                    const legacyProduct = product as FakeProduct & { sellerId?: string; sellerName?: string }
                    if ('sellerId' in legacyProduct || 'sellerName' in legacyProduct) {
                        delete legacyProduct.sellerId
                        delete legacyProduct.sellerName
                        changed = true
                    }
                }
                for (const seedUser of SEED_USERS) {
                    if (!existing.has(seedUser.email.toLowerCase())) {
                        db.users.push({ ...seedUser })
                        changed = true
                    }
                }
                const retiredCategoryIds = new Set(['cat-dashboard', 'cat-landing-page', 'cat-blog', 'cat-education', 'cat-web-app'])
                const keptCategories = db.categories.filter((category) => !retiredCategoryIds.has(category.id))
                if (keptCategories.length !== db.categories.length) changed = true
                db.categories = keptCategories
                for (const category of SEED_CATEGORIES) {
                    const index = db.categories.findIndex((item) => item.id === category.id)
                    if (index < 0) {
                        db.categories.push({ ...category })
                        changed = true
                    } else if (db.categories[index].name !== category.name || db.categories[index].slug !== category.slug || db.categories[index].description !== category.description || db.categories[index].icon !== category.icon || db.categories[index].image !== category.image) {
                        db.categories[index] = { ...category }
                        changed = true
                    }
                }
                const categoryMigration: Record<string, string> = {
                    'cat-dashboard': 'cat-web-app',
                    'cat-landing-page': 'cat-website',
                    'cat-blog': 'cat-website',
                    'cat-education': 'cat-web-app',
                }
                const categoryById = new Map(SEED_CATEGORIES.map((category) => [category.id, category]))
                for (const product of db.products) {
                    let targetId = product.categoryId ? categoryMigration[product.categoryId] ?? product.categoryId : undefined
                    if (!targetId) {
                        const oldCategory = product.category.toLocaleLowerCase()
                        if (oldCategory === 'dashboard' || oldCategory === 'giáo dục') targetId = 'cat-web-app'
                        else if (oldCategory === 'landing page' || oldCategory === 'blog & tin tức') targetId = 'cat-website'
                        else if (oldCategory === 'quản lý') targetId = 'cat-management'
                        else if (oldCategory === 'thương mại điện tử') targetId = 'cat-ecommerce'
                    }
                    const category = targetId ? categoryById.get(targetId) : undefined
                    if (category && (product.categoryId !== category.id || product.category !== category.name)) {
                        product.categoryId = category.id
                        product.category = category.name
                        changed = true
                    }
                }
                for (const product of SEED_PRODUCTS) {
                    const idx = db.products.findIndex((p) => p.id === product.id)
                    if (idx < 0) {
                        db.products.push({ ...product })
                        changed = true
                    } else {
                        db.products[idx] = { ...db.products[idx], ...product }
                        changed = true
                    }
                }
                if (changed) saveDb(db)
            }
        }
    } catch {
        db = null
    }
    if (!db) {
        db = seedDb()
        saveDb(db)
    }
    return db
}

export function nextId(db: FakeDb, prefix: string): string {
    db.seq += 1
    return `${prefix}-${db.seq}-${Date.now().toString(36)}`
}
