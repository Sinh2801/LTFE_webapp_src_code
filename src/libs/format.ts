export function formatPrice(value: number): string {
    return `${value.toLocaleString('vi-VN')} đ`
}

export function effectivePrice(item: { price: number; salePrice?: number }): number {
    return item.salePrice ?? item.price
}