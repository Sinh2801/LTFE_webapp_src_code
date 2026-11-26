import type { SocialProvider } from './types'

export interface ProviderInfo {
    id: SocialProvider
    name: string
    accounts: { fullName: string; email: string }[]
}

export const PROVIDERS: Record<SocialProvider, ProviderInfo> = {
    google: {
        id: 'google',
        name: 'Google',
        accounts: [
            { fullName: 'Lê Thanh Tuấn', email: 'thanhtuan.demo@gmail.com' },
            { fullName: 'Lê Văn Tính', email: 'vantinh.demo@gmail.com' },
            { fullName: 'Sinh Võ', email: 'demo@sourcecode.vn' },
        ],
    },
    facebook: {
        id: 'facebook',
        name: 'Facebook',
        accounts: [
            { fullName: 'Sinh Võ', email: 'sinhvo.demo@facebook.com' },
            { fullName: 'Tính Lê', email: 'hoangtu.demo@facebook.com' },
        ],
    },
}

export const isSocialProvider = (value: string | undefined): value is SocialProvider =>
    value === 'google' || value === 'facebook'
