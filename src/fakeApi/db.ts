// "csdl" giả lập lưu trong localStorage: người dùng và phiên đăng nhập.
import type { Category, Product, Order, OrderStatus, PaymentMethod } from '../libs/types'
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_USERS, SEED_ORDERS ,type SeedUser } from './seed'

const DB_KEY = 'fakeDb'
// v3 hash mật khẩu. Dữ liệu v1/v2 (mk thường).
const DB_VERSION = 3

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
        // localStorage bị chặn hoặc đầy: bỏ qua
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
                for (const seedUser of SEED_USERS) {
                    if (!existing.has(seedUser.email.toLowerCase())) db.users.push({ ...seedUser })
                }
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