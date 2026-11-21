export function formatPrice(value: number): string {
    return `${value.toLocaleString('vi-VN')} đ`
}

export function effectivePrice(item: { price: number; salePrice?: number }): number {
    return item.salePrice ?? item.price
}

export function formatBytes(bytes: number | undefined): string {
    if (!bytes || bytes <= 0) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function hasDiscount(item: { price: number; salePrice?: number }): boolean {
    return item.salePrice !== undefined && item.salePrice < item.price
}

export function formatDate(iso: string | Date, withTime = false): string {
    const date = typeof iso === 'string' ? new Date(iso) : iso
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleString('vi-VN', withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' })
}
