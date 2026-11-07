//tkdemo: demo@sourcecode.vn / 12345678
export interface SeedUser {
    id: string
    fullName: string
    email: string
    password: string
    createdAt: string
}

export const SEED_USERS: SeedUser[] = [
    {
        id: 'u-demo',
        fullName: 'Người dùng demo',
        email: 'demo@sourcecode.vn',
        password: '12345678',
        createdAt: '2026-10-15T08:00:00.000Z',
    },
]
