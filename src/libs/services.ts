import { api, downloadFile } from './apiClient'
import type {
    AuthResponse, Category, Order, PaginatedResult, PaymentMethod, Product, ProductQuery, Review, User,
} from './types'

export const authService = {
    register: (body: { fullName: string; email: string; password: string }) =>
        api.post<AuthResponse>('/auth/register', body, { auth: false }),
    login: (body: { email: string; password: string }) =>
        api.post<AuthResponse>('/auth/login', body, { auth: false }),
    //ajax check
    checkEmail: (email: string) =>
        api.get<{ available: boolean }>('/auth/check-email', { auth: false, query: { email } }),
    me: () => api.get<User>('/auth/me'),
    logout: () => api.post<null>('/auth/logout'),
}

export const userService = {
    updateProfile: (body: { fullName: string }) => api.put<User>('/users/me', body),
    changePassword: (body: { currentPassword: string; newPassword: string }) =>
        api.put<null>('/users/me/password', body),
}

export const catalogService = {
    categories: () => api.get<Category[]>('/categories', { auth: false }),
    products: (query: ProductQuery) =>
        api.get<PaginatedResult<Product>>('/products', { auth: false, query: { ...query } }),
    product: (id: string) => api.get<Product>(`/products/${encodeURIComponent(id)}`, { auth: false }),
    reviews: (productId: string) =>
        api.get<Review[]>(`/products/${encodeURIComponent(productId)}/reviews`, { auth: false }),
    addReview: (productId: string, body: { rating: number; comment: string }) =>
        api.post<Review>(`/products/${encodeURIComponent(productId)}/reviews`, body),
}

export const orderService = {
    list: () => api.get<Order[]>('/orders'),
    get: (id: string) => api.get<Order>(`/orders/${encodeURIComponent(id)}`),
    create: (productIds: string[]) => api.post<Order>('/orders', { productIds }),
    pay: (id: string, method: PaymentMethod) =>
        api.post<Order>(`/orders/${encodeURIComponent(id)}/pay`, { method }),
}

export const libraryService = {
    list: () => api.get<Product[]>('/library'),
    download: (productId: string) =>
        downloadFile(`/products/${encodeURIComponent(productId)}/download`),
}