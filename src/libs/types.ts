export type UserRole = 'user' | 'seller' | 'admin'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface Product {
    id: string
    code: string
    title: string
    description: string
    price: number // giá gốc
    salePrice?: number // giá bán (nếu có giảm)
    category: string
    technologies: string[]
    version?: string
    license?: string
    demoUrl?: string
    thumbnail?: string
    sellerName: string
    sellerId?: string
    downloads: number
    status?: ProductStatus
    createdAt: string
    updatedAt?: string
}

export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'hidden'

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    createdAt: string
    updatedAt?: string
}

export type OrderStatus = 'pending' | 'paid' | 'failed'

export interface OrderItem {
    productId: string
    title: string
    price: number
}

export interface Order {
    id: string
    items: OrderItem[]
    total: number
    status: OrderStatus
    createdAt: string
}
