import { api, downloadFile } from './apiClient'
import type {
    AuthResponse, Category, ForgotPasswordResult, LibraryItem, MailMessage, Order, PaginatedResult, PaymentMethod,
    Product, ProductQuery, Review, ReviewSummary, SocialProvider, User, WarrantyTicket, WarrantyType,
} from './types'

export const authService = {
    register: (body: { fullName: string; email: string; password: string; remember?: boolean }) =>
        api.post<AuthResponse>('/auth/register', body, { auth: false }),
    login: (body: { email: string; password: string; remember?: boolean }) =>
        api.post<AuthResponse>('/auth/login', body, { auth: false }),
    socialLogin: (body: { provider: SocialProvider; email: string; fullName: string; remember?: boolean }) =>
        api.post<AuthResponse>('/auth/social', body, { auth: false }),
    forgotPassword: (email: string) =>
        api.post<ForgotPasswordResult>('/auth/forgot-password', { email }, { auth: false }),
    verifyResetCode: (body: { email: string; code: string }) =>
        api.post<{ resetToken: string }>('/auth/verify-reset-code', body, { auth: false }),
    resetPassword: (body: { email: string; resetToken: string; newPassword: string }) =>
        api.post<null>('/auth/reset-password', body, { auth: false }),
    devMailbox: (email: string) =>
        api.get<MailMessage[]>('/auth/dev-mailbox', { auth: false, query: { email } }),
    checkEmail: (email: string) =>
        api.get<{ available: boolean }>('/auth/check-email', { auth: false, query: { email } }),
    me: () => api.get<User>('/auth/me'),
    logout: () => api.post<null>('/auth/logout'),
}

export const userService = {
    updateProfile: (body: { fullName: string }) => api.put<User>('/users/me', body),
    changePassword: (body: { currentPassword?: string; newPassword: string }) =>
        api.put<null>('/users/me/password', body),
}

export const catalogService = {
    categories: () => api.get<Category[]>('/categories', { auth: false }),
    products: (query: ProductQuery) =>
        api.get<PaginatedResult<Product>>('/products', { auth: false, query: { ...query } }),
    product: (id: string) => api.get<Product>(`/products/${encodeURIComponent(id)}`, { auth: false }),
    reviews: (productId: string) =>
        api.get<ReviewSummary>(`/products/${encodeURIComponent(productId)}/reviews`),
    addReview: (productId: string, body: { rating: number; comment: string }) =>
        api.post<Review>(`/products/${encodeURIComponent(productId)}/reviews`, body),
    updateReview: (reviewId: string, body: { rating: number; comment: string }) =>
        api.put<Review>(`/reviews/${encodeURIComponent(reviewId)}`, body),
}

export const orderService = {
    list: () => api.get<Order[]>('/orders'),
    get: (id: string) => api.get<Order>(`/orders/${encodeURIComponent(id)}`),
    create: (productIds: string[]) => api.post<Order>('/orders', { productIds }),
    pay: (id: string, method: PaymentMethod) =>
        api.post<Order>(`/orders/${encodeURIComponent(id)}/pay`, { method }),
}

export const libraryService = {
    list: () => api.get<LibraryItem[]>('/library'),
    download: (productId: string) =>
        downloadFile(`/products/${encodeURIComponent(productId)}/download`),
}

export const warrantyService = {
    list: () => api.get<WarrantyTicket[]>('/warranty-requests'),
    create: (body: { productId: string; type: WarrantyType; description: string }) =>
        api.post<WarrantyTicket>('/warranty-requests', body),
}
