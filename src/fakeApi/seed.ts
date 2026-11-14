//tkdemo: demo@sourcecode.vn / 12345678
//tknguoiban: seller@sourcecode.vn
import type {Category, Order, Product, UserRole} from '../libs/types'

export interface SeedUser {
    id: string
    fullName: string
    email: string
    passwordSalt: string
    passwordHash: string
    role: UserRole
    createdAt: string
}

export const SEED_USERS: SeedUser[] = [
    {
        id: 'u-demo',
        fullName: 'Người dùng demo',
        email: 'demo@sourcecode.vn',
        passwordSalt: 'seed-demo-buyer',
        passwordHash: '1fdafba7cf105bb30e63ffb31ce4c2845cec782587860090cc0b11c766c5d9d4',
        role: 'buyer',
        createdAt: '2026-10-15T08:00:00.000Z',
    },
    {
        id: 'u-seller-demo',
        fullName: 'Người bán demo',
        email: 'seller@sourcecode.vn',
        passwordSalt: 'seed-demo-seller',
        passwordHash: '82c613d71f2ea89a4e03e0d86ee7146456eeccbd8dda8e195499d21798c785e5',
        role: 'seller',
        createdAt: '2026-10-15T08:00:00.000Z',
    },
]

export const SEED_ORDERS: Order[] = []

export const SEED_CATEGORIES: Category[] = [
    {
        id: 'cat-ecommerce',
        name: 'Thương mại điện tử',
        slug: 'thuong-mai-dien-tu',
        description: 'Website và ứng dụng bán hàng trực tuyến.',
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-dashboard',
        name: 'Dashboard',
        slug: 'dashboard',
        description: 'Giao diện quản lý và thống kê dữ liệu.',
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-landing-page',
        name: 'Landing page',
        slug: 'landing-page',
        description: 'Trang giới thiệu sản phẩm hoặc dịch vụ.',
        createdAt: '2026-10-28T00:00:00.000Z',
    },
]

export const SEED_PRODUCTS: Product[] = [
    {
        id: 'product-shop-demo',
        code: 'SRC-SHOP-001',
        features: ['Giao diện hiện đại', 'Mã nguồn tốt, dễ phát triển'],
        usage: 'Giải nén file ZIP, cài thư viện (npm install), sau đó chạy npm run dev.',
        title: 'Website bán hàng React',
        description: 'Giao diện cửa hàng trực tuyến responsive.',
        price: 1200000,
        salePrice: 990000,
        category: 'Thương mại điện tử',
        technologies: ['React', 'TypeScript', 'CSS'],
        version: '1.0.0',
        license: 'Personal',
        demoUrl: 'https://example.com/demo/shop',
        sellerName: 'SourceCodeTST',
        sellerId: 'u-seller-demo',
        downloads: 42,
        status: 'approved',
        createdAt: '2026-10-30T00:00:00.000Z',
    },
    {
        id: 'product-dashboard-demo',
        code: 'SRC-DASH-001',
        features: ['Giao diện hiện đại', 'Mã nguồn tốt, dễ phát triển'],
        usage: 'Giải nén file ZIP, cài thư viện (npm install), sau đó chạy npm run dev.',
        title: 'Dashboard quản lý dữ liệu',
        description: 'Bộ giao diện dashboard với các màn hình thống kê.',
        price: 850000,
        category: 'Dashboard',
        technologies: ['React', 'TypeScript', 'Redux Toolkit'],
        version: '1.2.0',
        license: 'Commercial',
        demoUrl: 'https://example.com/demo/dashboard',
        sellerName: 'SourceCodeTST',
        sellerId: 'u-seller-demo',
        downloads: 27,
        status: 'approved',
        createdAt: '2026-10-29T00:00:00.000Z',
    },
    {
        id: 'product-landing-demo',
        code: 'SRC-LANDING-001',
        features: ['Giao diện hiện đại', 'Mã nguồn tốt, dễ phát triển'],
        usage: 'Giải nén file ZIP, cài thư viện (npm install), sau đó chạy npm run dev.',
        title: 'Landing page giới thiệu dịch vụ',
        description: 'Mẫu landing page gọn nhẹ, dễ tùy chỉnh.',
        price: 450000,
        category: 'Landing page',
        technologies: ['React', 'Vite', 'CSS'],
        version: '1.0.0',
        license: 'Personal',
        sellerName: 'SourceCodeTST',
        sellerId: 'u-seller-demo',
        downloads: 15,
        status: 'approved',
        createdAt: '2026-10-28T00:00:00.000Z',
    },
]
