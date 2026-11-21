import type { Product } from './types'

export interface InstallStep {
    title: string
    detail: string
    command?: string
}

export interface InstallGuide {
    requirements: string[]
    steps: InstallStep[]
    tips: string[]
}

const has = (product: Pick<Product, 'technologies'>, ...names: string[]): boolean =>
    product.technologies.some((tech) => names.some((name) => tech.toLowerCase().includes(name.toLowerCase())))

export function buildInstallGuide(product: Pick<Product, 'technologies' | 'usage'>): InstallGuide {
    const tips = [
        'Đọc file README trong gói mã nguồn trước khi chạy để biết biến môi trường cần cấu hình.',
        'Luôn sao lưu thư mục dự án trước khi nâng cấp thư viện hoặc đổi phiên bản Node.js/PHP.',
        'Gặp lỗi khi cài đặt? Gửi yêu cầu tại Hồ sơ → Bảo hành trong 30 ngày kể từ ngày mua.',
    ]
    const unzip: InstallStep = { title: 'Giải nén mã nguồn', detail: 'Giải nén file ZIP đã tải về vào thư mục làm việc, tránh đường dẫn có dấu tiếng Việt hoặc khoảng trắng.' }

    if (has(product, 'flutter', 'dart')) {
        return {
            requirements: ['Flutter SDK 3.x trở lên', 'Android Studio hoặc VS Code kèm plugin Flutter', 'Thiết bị thật hoặc máy ảo Android/iOS'],
            steps: [
                unzip,
                { title: 'Cài thư viện', detail: 'Mở terminal tại thư mục dự án và tải các package khai báo trong pubspec.yaml.', command: 'flutter pub get' },
                { title: 'Cấu hình Firebase', detail: 'Thay file google-services.json (Android) hoặc GoogleService-Info.plist (iOS) bằng cấu hình của bạn.' },
                { title: 'Chạy ứng dụng', detail: 'Kết nối thiết bị hoặc mở máy ảo rồi chạy lệnh dưới đây.', command: 'flutter run' },
            ],
            tips,
        }
    }
    if (has(product, 'unity')) {
        return {
            requirements: ['Unity Hub và đúng phiên bản Unity ghi trong ProjectVersion.txt', 'Visual Studio hoặc Rider hỗ trợ C#', 'Android/iOS Build Support nếu cần xuất bản'],
            steps: [
                unzip,
                { title: 'Mở dự án', detail: 'Trong Unity Hub chọn Add → chọn thư mục vừa giải nén, đợi Unity import tài nguyên lần đầu.' },
                { title: 'Kiểm tra Package Manager', detail: 'Mở Window → Package Manager và cài lại các gói báo thiếu (nếu có).' },
                { title: 'Chạy thử', detail: 'Mở scene chính trong thư mục Assets/Scenes rồi bấm Play.' },
            ],
            tips,
        }
    }
    if (has(product, 'cocos', 'lua', 'golang', 'go', 'python', 'mongodb')) {
        return {
            requirements: ['Python 3.9+ và Go 1.20+ cho phần server', 'MongoDB 6.x đang chạy', 'Cocos2d-x cùng bộ công cụ build Android/iOS'],
            steps: [
                unzip,
                { title: 'Khởi động database', detail: 'Bật dịch vụ MongoDB rồi nhập dữ liệu cấu hình .csv bằng công cụ có trong thư mục tools.' },
                { title: 'Chạy server', detail: 'Cài thư viện Python, sau đó khởi động server backend.', command: 'pip install -r requirements.txt && python server.py' },
                { title: 'Build client', detail: 'Mở project client bằng Cocos Console và build ra file .apk hoặc .ipa.' },
            ],
            tips,
        }
    }
    if (has(product, 'php', 'mysql', 'laravel')) {
        return {
            requirements: ['PHP 8.1+ kèm các extension mysqli/mbstring', 'MySQL 8 hoặc MariaDB', 'XAMPP/Laragon hoặc máy chủ Apache/Nginx'],
            steps: [
                unzip,
                { title: 'Đưa vào thư mục web', detail: 'Chép toàn bộ mã nguồn vào thư mục htdocs (XAMPP) hoặc www (Laragon).' },
                { title: 'Nhập cơ sở dữ liệu', detail: 'Tạo database mới trong phpMyAdmin rồi import file .sql đi kèm.' },
                { title: 'Cấu hình kết nối', detail: 'Sửa thông tin host, user, mật khẩu trong file config (hoặc .env) rồi truy cập http://localhost/ten-thu-muc.' },
            ],
            tips,
        }
    }
    const nodeSteps: InstallStep[] = [
        unzip,
        { title: 'Cài thư viện', detail: 'Mở terminal tại thư mục dự án và cài các package khai báo trong package.json.', command: 'npm install' },
        { title: 'Cấu hình môi trường', detail: 'Sao chép file .env.example thành .env và điền các giá trị cần thiết (API, khóa dịch vụ).' },
        { title: 'Chạy chế độ phát triển', detail: 'Khởi động server dev rồi mở địa chỉ hiển thị trong terminal (thường là http://localhost:5173).', command: 'npm run dev' },
        { title: 'Build bản triển khai', detail: 'Khi sẵn sàng đưa lên hosting, tạo bản build tối ưu.', command: 'npm run build' },
    ]
    const requirements = ['Node.js 18 trở lên (khuyến nghị bản LTS)', 'npm, yarn hoặc pnpm', 'Trình soạn thảo như VS Code']
    if (has(product, 'next')) requirements.push('Hosting hỗ trợ Next.js (Vercel, Netlify hoặc Node server) khi triển khai')
    return { requirements, steps: nodeSteps, tips }
}

/** Dạng văn bản thuần để ghi vào README trong gói ZIP. */
export function installGuideAsText(product: Pick<Product, 'technologies' | 'usage' | 'title'>): string {
    const guide = buildInstallGuide(product)
    const lines = [`# ${product.title}`, '', '## Yêu cầu môi trường', ...guide.requirements.map((r) => `- ${r}`), '', '## Các bước cài đặt']
    guide.steps.forEach((step, index) => {
        lines.push(`${index + 1}. ${step.title}: ${step.detail}`)
        if (step.command) lines.push(`   $ ${step.command}`)
    })
    lines.push('', '## Hướng dẫn riêng của sản phẩm', product.usage || '(không có)', '', '## Lưu ý', ...guide.tips.map((t) => `- ${t}`))
    return lines.join('\n')
}
