export type UserRole = 'buyer'
export type ProductStatus = 'approved' | 'hidden'

export interface User {
    id: string
    fullName: string
    email: string
    role: UserRole
    createdAt: string
}

export interface AuthResponse {
    user: User
    access_token: string
}

export interface Category {
    id: string
    name: string
    slug: string
    description: string
    icon?: string
    image?: string
    productCount?: number
    createdAt: string
}

export interface Product {
    id: string
    code: string
    title: string
    description: string
    features: string[]
    usage: string
    category: string
    categoryId?: string
    technologies: string[]
    version: string
    license: string
    price: number
    salePrice?: number
    thumbnail?: string
    demoUrl?: string
    fileName?: string
    fileSize?: number
    downloads: number
    rating?: number
    reviewCount?: number
    featured?: boolean
    status: ProductStatus
    createdAt: string
    updatedAt?: string
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'popular' | 'rating'

export interface ProductQuery {
    page?: number
    limit?: number
    q?: string
    category?: string
    tech?: string
    minPrice?: number
    maxPrice?: number
    sort?: ProductSort
    featured?: boolean
}

export interface PaginatedResult<T> {
    items: T[]
    page: number
    limit: number
    total: number
    totalPages: number
}

export type OrderStatus = 'pending' | 'paid' | 'failed'
export type PaymentMethod = 'card' | 'wallet'

export interface OrderItem {
    productId: string
    title: string
    price: number
    thumbnail?: string
}

export interface Order {
    id: string
    userId: string
    items: OrderItem[]
    total: number
    status: OrderStatus
    paymentMethod: PaymentMethod | null
    createdAt: string
    paidAt: string | null
}

export interface Review {
    id: string
    productId: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt: string
    updatedAt?: string
}

export interface ReviewSummary {
    items: Review[]
    average: number
    count: number
    distribution: Record<1 | 2 | 3 | 4 | 5, number>
    mine: Review | null
}
export interface LibraryItem extends Product {
    orderId: string
    purchasedAt: string
    downloadCount: number
    lastDownloadedAt: string | null
    warrantyExpiresAt: string
}

export type WarrantyType = 'bug' | 'install' | 'other'
export type WarrantyStatus = 'open' | 'processing' | 'resolved'

export interface WarrantyTicket {
    id: string
    userId: string
    productId: string
    productTitle: string
    orderId: string
    type: WarrantyType
    description: string
    status: WarrantyStatus
    reply: string | null
    createdAt: string
    updatedAt: string
}

export interface CartItem {
    id: string
    title: string
    price: number
    salePrice?: number
    thumbnail?: string
    categoryId?: string
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
    id: number
    type: ToastType
    message: string
}
