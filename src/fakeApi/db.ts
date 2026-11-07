// "csdl" giả lập lưu trong localStorage: người dùng và phiên đăng nhập.
import { SEED_USERS, type SeedUser } from './seed'

const DB_KEY = 'fakeDb'
const DB_VERSION = 1

export interface FakeDb {
    version: number
    seq: number
    users: SeedUser[]
    sessions: Record<string, string>
}

function seedDb(): FakeDb {
    return {
        version: DB_VERSION,
        seq: 100,
        users: SEED_USERS.map((u) => ({ ...u })),
        sessions: {},
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
            const parsed = JSON.parse(raw) as FakeDb
            if (parsed.version === DB_VERSION) db = parsed
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
