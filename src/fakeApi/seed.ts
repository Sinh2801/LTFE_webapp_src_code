import type {AuthProvider, Category, Order, Product, Review, UserRole} from '../libs/types'
import { DAY_MS } from '../libs/warranty'
import ecommerceCategoryImage from '../assets/category-ecommerce.png'
import managementCategoryImage from '../assets/category-management.png'
import websiteCategoryImage from '../assets/category-website.png'
import mobileAppCategoryImage from '../assets/category-mobile-app.png'
import desktopAppCategoryImage from '../assets/category-desktop-app.png'
import gameCategoryImage from '../assets/category-game.png'
import aiMlCategoryImage from '../assets/category-ai-ml.png'
import pluginsCategoryImage from '../assets/category-plugins.png'
import spaProductThumbnail from '../assets/product-spa-demo.png'
import inventoryProductThumbnail from '../assets/product-inventory-namit.png'
import minbookProductThumbnail from '../assets/product-minbook-store.png'
import knitknotProductThumbnail from '../assets/product-knitknot.jpg'
import gameHocVienThumbnail from '../assets/product-game-hocvien.jpg'

function makeThumbnail(label: string, color: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="${color}"/><rect x="48" y="48" width="544" height="304" rx="24" fill="#ffffff" opacity=".72"/><text x="320" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#123c70">${label}</text></svg>`
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export interface SeedUser {
    id: string
    fullName: string
    email: string
    passwordSalt: string
    passwordHash: string
    role: UserRole
    createdAt: string
    providers?: AuthProvider[]
    hasPassword?: boolean
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
]

export const SEED_CATEGORIES: Category[] = [
    {
        id: 'cat-website',
        name: 'Website',
        slug: 'website',
        description: 'Website giới thiệu, tin tức, blog và landing page.',
        icon: '🌐',
        image: websiteCategoryImage,
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-ai-ml',
        name: 'AI & Machine Learning',
        slug: 'ai-machine-learning',
        description: 'Ứng dụng trí tuệ nhân tạo, học máy, chatbot và tích hợp AI API.',
        icon: '🤖',
        image: aiMlCategoryImage,
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-ecommerce',
        name: 'Thương mại điện tử',
        slug: 'thuong-mai-dien-tu',
        description: 'Website và ứng dụng bán hàng trực tuyến.',
        icon: '🛒',
        image: ecommerceCategoryImage,
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-mobile-app',
        name: 'Ứng dụng di động',
        slug: 'ung-dung-di-dong',
        description: 'Ứng dụng Android, iOS và đa nền tảng.',
        icon: '📱',
        image: mobileAppCategoryImage,
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-desktop-app',
        name: 'Ứng dụng máy tính',
        slug: 'ung-dung-may-tinh',
        description: 'Phần mềm Windows, macOS và Linux; gồm WinForms, WPF, Electron.',
        icon: '💻',
        image: desktopAppCategoryImage,
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-game',
        name: 'Game',
        slug: 'game',
        description: 'Mã nguồn trò chơi, gameplay và dự án game mẫu.',
        icon: '🎮',
        image: gameCategoryImage,
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-management',
        name: 'Phần mềm quản lý',
        slug: 'phan-mem-quan-ly',
        description: 'Phần mềm CRM, ERP, quản lý bán hàng, kho và công việc.',
        icon: '📋',
        image: managementCategoryImage,
        createdAt: '2026-10-28T00:00:00.000Z',
    },
    {
        id: 'cat-plugins',
        name: 'Plugin & tiện ích',
        slug: 'plugin-tien-ich',
        description: 'Plugin, tiện ích trình duyệt và công cụ tích hợp.',
        icon: '🧩',
        image: pluginsCategoryImage,
        createdAt: '2026-10-28T00:00:00.000Z',
    },
]

export const SEED_PRODUCTS: Product[] = [
    {
        id: 'product-spa-demo',
        code: 'SRC-SPA-001',
        features: [
            'Đặt lịch hẹn trực tuyến 24/7 nhanh chóng tiện lợi',
            'Danh mục dịch vụ đa dạng: Chăm sóc da, Massage trị liệu, Giảm béo, Body',
            'Khung giới thiệu ưu đãi 20%, số liệu uy tín và chứng nhận thương hiệu',
            'Tối ưu chuẩn SEO và tương thích hoàn hảo mọi thiết bị'
        ],
        usage: 'Giải nén file ZIP, mở thư mục và chạy npm install, sau đó chạy npm run dev.',
        title: 'Amazonza Spa – Mẫu Website Dịch Vụ Spa & Thẩm Mỹ Cao Cấp',
        description: 'Amazonza Beauty & Spa: Mẫu website giới thiệu dịch vụ spa, thẩm mỹ viện cao cấp chuẩn responsive, thiết kế thanh lịch kèm hệ thống đặt lịch hẹn online.',
        price: 950000,
        salePrice: 750000,
        category: 'Website',
        categoryId: 'cat-website',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        version: '1.0.0',
        license: 'Commercial',
        thumbnail: spaProductThumbnail,
        demoUrl: 'https://example.com/demo/spa',
        downloads: 68,
        rating: 5.0,
        reviewCount: 26,
        featured: true,
        status: 'approved',
        createdAt: '2026-11-02T00:00:00.000Z',
    },
    {
        id: 'product-dashboard-demo',
        code: 'SRC-MINBOOK-01',
        features: [
            'Tìm kiếm nhanh có gợi ý sản phẩm tự động',
            'Voucher giảm giá & Flash sale hiển thị tại trang chủ',
            'Danh sách sản phẩm yêu thích và lưu trữ tiện lợi',
            'Mega menu hiển thị danh mục đa dạng chuẩn responsive',
            'Hệ thống chi nhánh cửa hàng theo tỉnh thành',
            'Giao diện tối ưu chuẩn SEO và tốc độ tải trang cực nhanh'
        ],
        usage: 'Giải nén file mã nguồn, mở terminal chạy npm install để cài đặt thư viện cần thiết, cấu hình file .env và chạy npm run dev.',
        title: 'Min Book Store – Giao diện Website Bán Sách & Văn Phòng Phẩm',
        description: 'Min Book Store: Giao diện website thương mại điện tử chuyên nghiệp dành cho nhà sách, truyện tranh và văn phòng phẩm. Tích hợp đầy đủ giỏ hàng, tìm kiếm gợi ý, voucher ưu đãi và hệ thống chi nhánh.',
        price: 2400000,
        salePrice: 1850000,
        category: 'Thương mại điện tử',
        categoryId: 'cat-ecommerce',
        technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js'],
        version: '2.1.0',
        license: 'Commercial',
        thumbnail: minbookProductThumbnail,
        demoUrl: 'https://minbooks-demo.vercel.app',
        downloads: 425,
        rating: 4.9,
        reviewCount: 38,
        featured: true,
        status: 'approved',
        createdAt: '2026-10-30T10:00:00.000Z',
    },
    {
        id: 'product-landing-demo',
        code: 'SRC-KNITKNOT-01',
        features: [
            'Bố cục giới thiệu năng lực sản xuất và quy mô nhà máy chuyên nghiệp',
            'Trình bày danh mục sản phẩm dệt may và mẫu vải sắc nét',
            'Tối ưu hiển thị responsive hoàn hảo trên điện thoại và máy tính',
            'Tích hợp form đăng ký tư vấn báo giá và liên hệ nhanh',
            'Chuẩn SEO, tốc độ tải trang nhanh và dễ dàng tùy biến giao diện'
        ],
        usage: 'Giải nén thư mục source code, mở terminal chạy npm install để cài đặt dependencies, sau đó chạy npm run dev để khởi chạy giao diện.',
        title: 'Knit Knot – Giao diện Website Doanh Nghiệp Dệt May & Xuất Khẩu',
        description: 'Knit Knot: Giao diện website chuyên sâu cho doanh nghiệp dệt may, sản xuất vải và may mặc. Thiết kế hiện đại, tối giản và chuẩn doanh nghiệp, giúp xây dựng hình ảnh thương hiệu uy tín trong mắt đối tác quốc tế.',
        price: 2300000,
        salePrice: 1750000,
        category: 'Website',
        categoryId: 'cat-website',
        technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
        version: '1.0.0',
        license: 'Commercial',
        thumbnail: knitknotProductThumbnail,
        demoUrl: 'https://knitknot-demo.vercel.app',
        downloads: 380,
        rating: 4.9,
        reviewCount: 24,
        featured: true,
        status: 'approved',
        createdAt: '2026-10-29T12:00:00.000Z',
    },
    {
        id: 'product-blog-demo',
        code: 'SP_YICFG5',
        features: [
            'Client Cocos2dx (.lua) đầy đủ project build được file .apk và .ipa',
            'Server backend Python, MongoDB và Golang hiệu năng cao',
            'Bộ Website User đăng ký/đăng nhập và Website Admin quản trị',
            'Full bộ Tool quản lý tài nguyên và dữ liệu cấu hình .csv'
        ],
        usage: 'Cài đặt môi trường Cocos Simulator / Cocos2dx, thiết lập MongoDB và chạy Server Python/Go theo tài liệu đính kèm. Hỗ trợ build trực tiếp ra file .apk và .ipa.',
        title: 'Source Game Mobile Học Viện Nữ Thần',
        description: 'Full source code game mobile Học Viện Nữ Thần có thể rebuild hoàn chỉnh. Bao gồm Client Cocos2dx (.lua), Server Python & Golang, CSDL MongoDB, bộ website quản trị admin & user và full bộ tool CSV.',
        price: 20000000,
        salePrice: 2000000,
        category: 'Game',
        categoryId: 'cat-game',
        technologies: ['Cocos2dx', 'Python', 'Go', 'MongoDB', 'Lua'],
        version: '1.0.0',
        license: 'Commercial',
        thumbnail: gameHocVienThumbnail,
        demoUrl: 'https://example.com/demo/hoc-vien-nu-than',
        downloads: 124,
        rating: 5.0,
        reviewCount: 18,
        featured: true,
        status: 'approved',
        createdAt: '2026-11-01T12:00:00.000Z',
    },
    {
        id: 'product-inventory-demo',
        code: 'SRC-45629',
        features: [
            'Quản lý kho hàng & kiểm kê tồn kho chính xác',
            'Quản lý nhiều cửa hàng & nhãn hiệu',
            'Phân quyền nhóm người dùng đơn giản và hiệu quả',
            'Quản lý đơn hàng, báo cáo & thống kê doanh thu'
        ],
        usage: 'File download: QuanLyKho.rar [27 MB]. Import database MySQL vào phpMyAdmin, cấu hình config kết nối CSDL và chạy trên môi trường XAMPP/WAMP/Laragon.',
        title: 'Full Source Code Quản Lý Kho Viết Bằng PHP MySQL',
        description: 'Full code quản lý kho và quản lý bán hàng được viết bằng ngôn ngữ lập trình PHP sử dụng CSDL MySQL. Đầy đủ chức năng quản lý kho hàng, sản phẩm, nhiều cửa hàng, nhãn hiệu và phân quyền người dùng.',
        price: 650000,
        salePrice: 450000,
        category: 'Phần mềm quản lý',
        categoryId: 'cat-management',
        technologies: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
        version: '1.0.0',
        license: 'Commercial',
        thumbnail: inventoryProductThumbnail,
        demoUrl: 'http://localhost:8000/auth/login',
        downloads: 6619,
        rating: 5.0,
        reviewCount: 19,
        featured: true,
        status: 'approved',
        createdAt: '2026-10-25T00:00:00.000Z',
    },
    {
        id: 'product-course-demo',
        code: 'SRC-EDU-001',
        features: ['Danh sách khóa học', 'Theo dõi tiến độ học'],
        usage: 'Cài thư viện bằng npm install rồi chạy npm run dev.',
        title: 'Nền tảng học trực tuyến E-Learning',
        description: 'Giao diện khóa học, bài học và theo dõi tiến độ.',
        price: 620000,
        category: 'AI & Machine Learning',
        categoryId: 'cat-ai-ml',
        technologies: ['React', 'TypeScript', 'Redux Toolkit'],
        version: '1.0.0',
        license: 'Personal',
        thumbnail: makeThumbnail('LEARNING', '#cffafe'),
        downloads: 23,
        rating: 4.9,
        reviewCount: 11,
        featured: true,
        status: 'approved',
        createdAt: '2026-10-20T00:00:00.000Z',
    },
    {
        id: 'product-pos-cafe',
        code: 'SRC-POS-CAFE',
        features: ['Order món tại bàn', 'Quản lý hóa đơn & thanh toán', 'In bill tức thì'],
        usage: 'Mở bằng Android Studio hoặc VS Code với Flutter SDK, chạy flutter pub get và flutter run.',
        title: 'Giao diện App Quản Lý Bán Hàng & Order Cafe POS',
        description: 'Ứng dụng di động quản lý quán cafe, nhà hàng và trà sữa. Hỗ trợ gọi món, quản lý sơ đồ bàn và kết nối máy in hóa đơn.',
        price: 1200000,
        salePrice: 890000,
        category: 'Ứng dụng di động',
        categoryId: 'cat-mobile-app',
        technologies: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
        version: '1.5.0',
        license: 'Commercial',
        thumbnail: makeThumbnail('POS CAFE', '#fed7aa'),
        downloads: 156,
        rating: 4.8,
        reviewCount: 14,
        featured: true,
        status: 'approved',
        createdAt: '2026-10-15T00:00:00.000Z',
    },
    {
        id: 'product-unity-game',
        code: 'SRC-GAME-2D',
        features: ['Gameplay hoàn chỉnh', 'Hệ thống vật phẩm & nâng cấp', 'Hiệu ứng âm thanh sống động'],
        usage: 'Mở project bằng Unity 2022.3 LTS trở lên, mở Scene MainMenu và nhấn Play để trải nghiệm.',
        title: 'Full Source Code Game 2D Phiêu Lưu Sinh Tồn – Unity C#',
        description: 'Mã nguồn trò chơi 2D hoàn chỉnh viết bằng Unity C#. Bao gồm hệ thống chiến đấu, nâng cấp kỹ năng, cửa hàng vật phẩm và lưu dữ liệu người chơi.',
        price: 1500000,
        salePrice: 1100000,
        category: 'Game',
        categoryId: 'cat-game',
        technologies: ['Unity', 'C#', 'Spine 2D'],
        version: '2.0.0',
        license: 'Commercial',
        thumbnail: makeThumbnail('UNITY 2D', '#e2e8f0'),
        downloads: 280,
        rating: 5.0,
        reviewCount: 22,
        featured: true,
        status: 'approved',
        createdAt: '2026-10-10T00:00:00.000Z',
    },
]

const priceOf = (id: string): number => {
    const product = SEED_PRODUCTS.find((item) => item.id === id) as Product
    return product.salePrice ?? product.price
}

function seedOrder(id: string, productId: string, daysAgo: number): Order {
    const product = SEED_PRODUCTS.find((item) => item.id === productId) as Product
    const paidAt = new Date(Date.now() - daysAgo * DAY_MS).toISOString()
    return {
        id,
        userId: 'u-demo',
        items: [{ productId, title: product.title, price: priceOf(productId), thumbnail: product.thumbnail }],
        total: priceOf(productId),
        status: 'paid',
        paymentMethod: 'card',
        createdAt: paidAt,
        paidAt,
    }
}

export const SEED_ORDERS: Order[] = [
    seedOrder('o-seed-1', 'product-landing-demo', 12),
    seedOrder('o-seed-2', 'product-blog-demo', 45),
]

const REVIEWER_NAMES = [
    'Thanh Tuấn', 'Văn Tính', 'Võ Sinh', 'Hoàng Quân', 'Minh Anh', 'Ngọc Hân',
    'Quốc Bảo', 'Thu Trang', 'Đức Huy', 'Khánh Linh', 'Gia Bảo', 'Phương Thảo',
]
const COMMENTS_5 = [
    'Code sạch, cấu trúc thư mục rõ ràng, cài đặt xong chạy ngay.',
    'Giao diện đẹp đúng như bản demo, tiết kiệm cho mình rất nhiều thời gian.',
    'Tài liệu hướng dẫn chi tiết, được hỗ trợ cài đặt rất nhanh.',
    'Mua làm đồ án, thầy khen phần giao diện và cách tổ chức component.',
    'Giá hợp lý so với chất lượng. Sẽ ủng hộ thêm các sản phẩm khác.',
    'Responsive tốt trên cả điện thoại và máy tính, không phải sửa nhiều.',
    'Hỗ trợ kỹ thuật phản hồi trong ngày, xử lý lỗi môi trường rất gọn.',
    'Tải về nhiều lần không giới hạn nên rất yên tâm khi đổi máy.',
]
const COMMENTS_4 = [
    'Chất lượng tốt, chỉ cần chỉnh thêm một vài chỗ cho hợp dự án của mình.',
    'Code ổn, mong có thêm ghi chú trong phần xử lý nâng cao.',
    'Giao diện đẹp, cài đặt hơi lâu do phải cấu hình biến môi trường.',
]

export function makeSeedReviews(): Review[] {
    const reviews: Review[] = []
    for (const product of SEED_PRODUCTS) {
        const count = Math.min(product.reviewCount ?? 0, 40)
        const target = Math.round((product.rating ?? 5) * count)
        let deficit = Math.max(0, count * 5 - target)
        for (let index = 0; index < count; index += 1) {
            let rating = 5
            if (deficit > 0 && index % 3 === 1) {
                rating = 4
                deficit -= 1
            }
            const pool = rating === 5 ? COMMENTS_5 : COMMENTS_4
            const created = new Date(Date.UTC(2026, 10, 18) - (index * 2 + 1) * DAY_MS).toISOString()
            reviews.push({
                id: `rv-seed-${product.id}-${index}`,
                productId: product.id,
                userId: `u-seed-${index}`,
                userName: REVIEWER_NAMES[(index + product.code.length) % REVIEWER_NAMES.length],
                rating,
                comment: pool[(index + product.title.length) % pool.length],
                createdAt: created,
            })
        }
        const own = reviews.filter((r) => r.productId === product.id)
        for (let i = own.length - 1; i >= 0 && deficit > 0; i -= 1) {
            if (own[i].rating === 5) {
                own[i].rating = 4
                own[i].comment = COMMENTS_4[i % COMMENTS_4.length]
                deficit -= 1
            }
        }
    }
    return reviews
}
