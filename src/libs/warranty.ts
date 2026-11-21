import type { WarrantyStatus, WarrantyType } from './types'

export const WARRANTY_DAYS = 30
export const DAY_MS = 24 * 60 * 60 * 1000
export const WARRANTY_DESC_MIN = 10
export const WARRANTY_DESC_MAX = 1000

export const WARRANTY_TYPES: { value: WarrantyType; label: string; hint: string }[] = [
    { value: 'bug', label: 'Lỗi mã nguồn', hint: 'Chạy lỗi, build thất bại hoặc sai so với mô tả sản phẩm' },
    { value: 'install', label: 'Hỗ trợ cài đặt', hint: 'Cần hướng dẫn cài đặt, cấu hình môi trường, kết nối database' },
    { value: 'other', label: 'Vấn đề khác', hint: 'Câu hỏi về giấy phép, cập nhật phiên bản hoặc nội dung khác' },
]

export const WARRANTY_STATUS_LABEL: Record<WarrantyStatus, string> = {
    open: 'Đã tiếp nhận',
    processing: 'Đang xử lý',
    resolved: 'Đã giải quyết',
}

export const WARRANTY_COVERED = [
    'Lỗi chạy sai so với mô tả hoặc bản demo của sản phẩm',
    'Thiếu file, thiếu thư viện hoặc sai phiên bản khai báo trong mã nguồn',
    'Hướng dẫn cài đặt, cấu hình môi trường và kết nối cơ sở dữ liệu',
    'Cập nhật bản vá trong cùng phiên bản đã mua',
]

export const WARRANTY_EXCLUDED = [
    'Chỉnh sửa, thêm tính năng hoặc đổi giao diện theo yêu cầu riêng',
    'Lỗi phát sinh do bạn tự sửa mã nguồn hoặc nâng cấp thư viện',
    'Triển khai lên hosting, tên miền, chứng chỉ SSL hoặc dịch vụ bên thứ ba',
    'Sử dụng sai phạm vi giấy phép của sản phẩm',
]

export const WARRANTY_STEPS = [
    'Mở Hồ sơ → Bảo hành và chọn mã nguồn cần hỗ trợ',
    'Chọn loại vấn đề, mô tả lỗi và các bước bạn đã thử',
    'Hệ thống ghi nhận yêu cầu ngay, kỹ thuật viên phản hồi trong tối đa 24 giờ làm việc',
    'Theo dõi trạng thái và nội dung phản hồi ngay trong tab Bảo hành',
]

export interface WarrantyInfo {
    expiresAt: Date
    active: boolean
    daysLeft: number
}
export function warrantyFrom(purchasedAt: string, now = Date.now()): WarrantyInfo {
    const expiresAt = new Date(new Date(purchasedAt).getTime() + WARRANTY_DAYS * DAY_MS)
    const remaining = expiresAt.getTime() - now
    return { expiresAt, active: remaining > 0, daysLeft: Math.max(0, Math.ceil(remaining / DAY_MS)) }
}
