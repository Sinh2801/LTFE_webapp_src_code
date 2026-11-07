// "csdl" giả lập lưu trong localStorage: người dùng và phiên đăng nhập.
import type { Category, Product } from '../libs/types'
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_USERS, type SeedUser } from './seed'

const DB_KEY = 'fakeDb'
const DB_VERSION = 2

export interface FakeDb {
    version: number
    seq: number
    users: SeedUser[]
    sessions: Record<string, string>
    products: Product[]
    categories: Category[]
}

function seedDb(): FakeDb {
    return {
        version: DB_VERSION,
        seq: 100,
        users: SEED_USERS.map((u) => ({ ...u })),
        sessions: {},
        products: SEED_PRODUCTS.map((product) => ({ ...product })),
        categories: SEED_CATEGORIES.map((category) => ({ ...category })),
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
    let needsSave = false
    try {
        const raw = localStorage.getItem(DB_KEY)
        if (raw) {
            const parsed = JSON.parse(raw) as Partial<FakeDb>
            if (parsed.version === 1 || parsed.version === DB_VERSION) {
                db = {
                    version: DB_VERSION,
                    seq: typeof parsed.seq === 'number' ? parsed.seq : 100,
                    users: Array.isArray(parsed.users) ? parsed.users : SEED_USERS.map((u) => ({ ...u })),
                    sessions: parsed.sessions && typeof parsed.sessions === 'object' ? parsed.sessions : {},
                    products: Array.isArray(parsed.products)
                        ? parsed.products
                        : SEED_PRODUCTS.map((product) => ({ ...product })),
                    categories: Array.isArray(parsed.categories)
                        ? parsed.categories
                        : SEED_CATEGORIES.map((category) => ({ ...category })),
                }
                const existingEmails = new Set(db.users.map((user) => user.email.toLowerCase()))
                const missingSeedUsers = SEED_USERS.filter((user) => !existingEmails.has(user.email.toLowerCase()))
                if (missingSeedUsers.length > 0) {
                    db.users.push(...missingSeedUsers.map((user) => ({ ...user })))
                    needsSave = true
                }
                for (const user of db.users) {
                    const seedUser = SEED_USERS.find((seed) => seed.email.toLowerCase() === user.email.toLowerCase())
                    if (!user.role && seedUser?.role) {
                        user.role = seedUser.role
                        needsSave = true
                    }
                }
                needsSave = needsSave
                    || parsed.version !== DB_VERSION
                    || !Array.isArray(parsed.products)
                    || !Array.isArray(parsed.categories)
            }
        }
    } catch {
        db = null
    }
    if (!db) {
        db = seedDb()
        needsSave = true
    }
    if (needsSave) saveDb(db)
    return db
}

export function nextId(db: FakeDb, prefix: string): string {
    db.seq += 1
    return `${prefix}-${db.seq}-${Date.now().toString(36)}`
}
