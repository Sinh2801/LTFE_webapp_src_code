import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import InstallGuide from '../components/product/InstallGuide'
import WarrantyPolicy from '../components/product/WarrantyPolicy'
import { WARRANTY_DAYS } from '../libs/warranty'

const SECTIONS = [
    { id: 'mua-va-tai', label: 'Mua & tải mã nguồn' },
    { id: 'giay-phep', label: 'Giấy phép sử dụng' },
    { id: 'bao-hanh', label: 'Bảo hành & hỗ trợ' },
    { id: 'huong-dan-cai-dat', label: 'Hướng dẫn cài đặt' },
    { id: 'hoan-tien', label: 'Hoàn tiền' },
    { id: 'cau-hoi', label: 'Câu hỏi thường gặp' },
]

const FAQ = [
    { q: 'Tôi có phải trả thêm phí để tải lại mã nguồn không?', a: 'Không. Mỗi mã nguồn chỉ mua một lần trên mỗi tài khoản và bạn được tải lại không giới hạn tại Hồ sơ → Mã nguồn đã mua.' },
    { q: 'Tôi chưa đăng nhập có thể làm gì?', a: 'Bạn có thể xem sản phẩm, đọc đánh giá, lưu yêu thích và thêm vào giỏ hàng. Thanh toán, tải mã nguồn, đánh giá và bảo hành yêu cầu đăng nhập.' },
    { q: 'Ai được viết đánh giá?', a: 'Chỉ tài khoản đã mua và thanh toán thành công sản phẩm đó. Mỗi người đánh giá một lần cho mỗi sản phẩm và có thể chỉnh sửa sau đó.' },
    { q: `Bảo hành ${WARRANTY_DAYS} ngày tính từ lúc nào?`, a: 'Tính từ thời điểm đơn hàng được thanh toán thành công, riêng cho từng mã nguồn. Hạn bảo hành hiển thị trong thư viện mã nguồn đã mua.' },
    { q: 'Thanh toán bị lỗi thì sao?', a: 'Đơn hàng vẫn được lưu và sản phẩm còn trong giỏ. Bạn có thể đổi phương thức và thanh toán lại, không bị tính tiền khi giao dịch thất bại.' },
]

function PolicyPage() {
    const { hash } = useLocation()

    useEffect(() => { document.title = 'Chính sách & hướng dẫn | SourceCodeTST' }, [])
    useEffect(() => {
        if (!hash) return
        const timer = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
        return () => window.clearTimeout(timer)
    }, [hash])

    return (
        <>
            <section className="policy-banner">
                <div className="policy-banner__content">
                    <span className="policy-banner__sub">SourceCodeTST</span>
                    <h1 className="policy-banner__title">CHÍNH SÁCH</h1>
                </div>
                <div className="ux-shape-divider ux-shape-divider--bottom">
                    <svg viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path
                            className="ux-shape-fill"
                            d="M1000 100H0V80H479.686C481.808 80 483.843 80.8429 485.343 82.3432L497.879 94.8787C499.05 96.0503 500.95 96.0503 502.121 94.8787L514.657 82.3431C516.157 80.8428 518.192 80 520.314 80H1000V100Z"
                        />
                    </svg>
                </div>
            </section>

            <main className="policy-page">
                <header className="policy-intro">
                    <p>Quyền lợi của bạn sau khi mua mã nguồn: tải nhiều lần, bảo hành {WARRANTY_DAYS} ngày, hướng dẫn cài đặt và chính sách hoàn tiền rõ ràng.</p>
                </header>

                <nav className="policy-nav" aria-label="Mục lục">
                    {SECTIONS.map((item) => <a key={item.id} href={`#${item.id}`} onClick={(event) => { event.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{item.label}</a>)}
                </nav>

                <section className="policy-section" id="mua-va-tai">
                    <h2>Mua &amp; tải mã nguồn</h2>
                    <ul className="check-list">
                        <li>Mỗi tài khoản mua một mã nguồn một lần. Hệ thống chặn thanh toán trùng sản phẩm đã sở hữu.</li>
                        <li>Sau khi thanh toán thành công, bạn tải mã nguồn ngay trên trang đơn hàng hoặc trong Hồ sơ → Mã nguồn đã mua.</li>
                        <li>Tải lại không giới hạn số lần, kể cả khi đổi máy hoặc mất file cũ.</li>
                        <li>Khách chưa đăng nhập xem và thêm giỏ hàng được; thanh toán và tải về cần đăng nhập.</li>
                    </ul>
                </section>

                <section className="policy-section" id="giay-phep">
                    <h2>Giấy phép sử dụng</h2>
                    <div className="policy-cards">
                        <article><h3>Personal</h3><p>Dùng cho học tập, đồ án, dự án cá nhân không thu phí.</p></article>
                        <article><h3>Commercial</h3><p>Dùng cho một dự án thương mại hoặc một khách hàng.</p></article>
                        <article><h3>Extended</h3><p>Dùng cho nhiều dự án; không được bán lại nguyên bản mã nguồn.</p></article>
                    </div>
                    <p className="policy-note">Bạn không được phân phối, bán lại hoặc đăng công khai mã nguồn gốc dưới bất kỳ hình thức nào.</p>
                </section>

                <section className="policy-section" id="bao-hanh">
                    <h2>Bảo hành &amp; hỗ trợ</h2>
                    <WarrantyPolicy />
                </section>

                <section className="policy-section" id="huong-dan-cai-dat">
                    <h2>Hướng dẫn cài đặt chung</h2>
                    <p className="policy-note">Mỗi sản phẩm có hướng dẫn riêng theo công nghệ ở tab “Hướng dẫn cài đặt” trong trang chi tiết. Dưới đây là quy trình phổ biến cho dự án Node.js.</p>
                    <InstallGuide product={{ technologies: ['React', 'Node.js'], usage: '' }} />
                </section>

                <section className="policy-section" id="hoan-tien">
                    <h2>Chính sách hoàn tiền</h2>
                    <ul className="check-list">
                        <li>Hoàn tiền 100% trong 7 ngày kể từ ngày thanh toán nếu mã nguồn sai khác nghiêm trọng so với mô tả và không được khắc phục trong 3 ngày làm việc.</li>
                        <li>Hoàn tiền khi bị trừ tiền nhưng đơn hàng không ghi nhận thanh toán thành công.</li>
                    </ul>
                    <ul className="check-list check-list--no">
                        <li>Không hoàn tiền khi đổi ý, mua nhầm sau khi đã tải mã nguồn hoặc đã đưa vào sử dụng thương mại.</li>
                        <li>Không hoàn tiền khi lỗi phát sinh do chỉnh sửa mã nguồn hoặc môi trường của bạn.</li>
                    </ul>
                </section>

                <section className="policy-section" id="cau-hoi">
                    <h2>Câu hỏi thường gặp</h2>
                    <div className="faq">
                        {FAQ.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
                    </div>
                </section>

                <div className="policy-cta">
                    <div><strong>Cần hỗ trợ cho mã nguồn đã mua?</strong><span>Gửi yêu cầu bảo hành trong Hồ sơ, kỹ thuật viên phản hồi trong tối đa 24 giờ làm việc.</span></div>
                    <Link className="btn-solid" to="/profile?tab=bao-hanh">Gửi yêu cầu bảo hành</Link>
                </div>
            </main>
        </>
    )
}

export default PolicyPage
