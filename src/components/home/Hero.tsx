import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (isPaused) return
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
        }, 6500)
        return () => clearInterval(timer)
    }, [isPaused])

    function nextSlide() {
        setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
    }

    function prevSlide() {
        setCurrentSlide((prev) => (prev === 0 ? 1 : 0))
    }

    return (
        <section
            className={`home-hero home-hero--slide-${currentSlide}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <button
                type="button"
                className="hero-slider-arrow hero-slider-arrow--left"
                onClick={prevSlide}
                aria-label="Slide trước"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>

            <button
                type="button"
                className="hero-slider-arrow hero-slider-arrow--right"
                onClick={nextSlide}
                aria-label="Slide tiếp theo"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 6 6 6-6 6" />
                </svg>
            </button>

            <div className={`home-hero__slide home-hero__slide--main ${currentSlide === 0 ? 'is-active' : ''}`}>
                <div className="home-hero__content">
                    <span className="home-hero__eyebrow">CHỢ MÃ NGUỒN TRỰC TUYẾN</span>
                    <h1>
                        <span>Khám phá - Mua - Sở hữu</span>
                        <span className="home-hero__title-accent">Mã nguồn chất lượng</span>
                    </h1>
                    <p>Kho mã nguồn website và ứng dụng đa lĩnh vực, được cung cấp trực tiếp bởi SourceCodeTST.</p>
                    <div className="home-hero__benefits">
                        <div className="home-hero__benefit">
                            <span className="home-hero__benefit-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 5l-4 14" /></svg>
                            </span>
                            <span>Đa dạng<br />mã nguồn</span>
                        </div>
                        <div className="home-hero__benefit">
                            <span className="home-hero__benefit-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24"><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.3 2.3 4.7-5" /></svg>
                            </span>
                            <span>Kiểm duyệt<br />chất lượng</span>
                        </div>
                        <div className="home-hero__benefit">
                            <span className="home-hero__benefit-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24"><path d="m13.5 2-9 12h6l-.8 8 9.8-13h-6.2l.2-7Z" /></svg>
                            </span>
                            <span>Tải về ngay<br />sau khi mua</span>
                        </div>
                    </div>
                    <div className="home-hero__actions">
                        <Link className="home-button home-button--hero" to="/products">
                            Khám phá ngay <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={`home-hero__slide home-hero__slide--contact ${currentSlide === 1 ? 'is-active' : ''}`}>
                <div className="home-hero__slide-inner">
                    <div className="home-hero__content home-hero__content--contact">
                        <span className="home-hero__eyebrow home-hero__eyebrow--orange">HỖ TRỢ & TƯ VẤN DỰ ÁN</span>
                        <h1>
                            <span>Đồng hành cùng dự án của bạn</span>
                            <span className="home-hero__title-accent home-hero__title-accent--orange">Tư vấn & Hỗ trợ kỹ thuật 24/7</span>
                        </h1>
                        <p>Đội ngũ SourceCodeTST sẵn sàng tư vấn chọn mã nguồn, hướng dẫn cài đặt qua Ultraview và tùy biến tính năng theo yêu cầu riêng.</p>
                        <div className="home-hero__contact-badges">
                            <span className="contact-badge">✓ Cài đặt & Hướng dẫn qua Ultraview</span>
                            <span className="contact-badge">✓ Tùy biến mã nguồn theo yêu cầu</span>
                            <span className="contact-badge">✓ Hỗ trợ kỹ thuật sau bàn giao</span>
                        </div>
                        <div className="home-hero__actions">
                            <a className="home-button home-button--contact" href="/#tin-tuc">
                                Liên hệ tư vấn ngay <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>

                    <div className="home-hero__verify-card">
                        <div className="verify-card__header">
                            <div className="verify-card__dots">
                                <span className="dot dot--red" />
                                <span className="dot dot--yellow" />
                                <span className="dot dot--green" />
                            </div>
                            <span className="verify-card__filename">verifiedSource.ts</span>
                            <span className="verify-card__verified-pill">✓ ĐÃ DUYỆT 100%</span>
                        </div>
                        <div className="verify-card__code">
                            <div className="code-line">
                                <span className="code-num">1</span>
                                <span className="code-text"><span className="code-kw">import</span> {'{ scanSecurity, testDb }'} <span className="code-kw">from</span> <span className="code-str">'@tst/audit'</span></span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">2</span>
                                <span className="code-text"><span className="code-kw">export async function</span> <span className="code-fn">verifyPackage</span>() {'{'}</span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">3</span>
                                <span className="code-text code-indent"><span className="code-kw">const</span> audit = <span className="code-kw">await</span> <span className="code-fn">scanSecurity</span>({'{'} <span className="code-prop">threats</span>: <span className="code-numval">0</span> {'}'})</span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">4</span>
                                <span className="code-text code-indent"><span className="code-kw">const</span> db = <span className="code-kw">await</span> <span className="code-fn">testDb</span>({'{'} <span className="code-prop">seed</span>: <span className="code-bool">true</span> {'}'})</span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">5</span>
                                <span className="code-text code-indent"><span className="code-kw">return</span> {'{'}</span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">6</span>
                                <span className="code-text code-indent-2"><span className="code-prop">status</span>: <span className="code-str">'100% APPROVED'</span>,</span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">7</span>
                                <span className="code-text code-indent-2"><span className="code-prop">ultraview</span>: <span className="code-bool">true</span>,</span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">8</span>
                                <span className="code-text code-indent-2"><span className="code-prop">warrantyDays</span>: <span className="code-numval">30</span></span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">9</span>
                                <span className="code-text code-indent">{'}'}</span>
                            </div>
                            <div className="code-line">
                                <span className="code-num">10</span>
                                <span className="code-text">{'}'}</span>
                            </div>
                        </div>
                        <div className="verify-card__footer">
                            <span className="verify-card__status">
                                <span className="status-indicator" /> BUILD: SUCCESSFUL (0 ERRORS)
                            </span>
                            <span className="verify-card__stamp">✓ VERIFIED</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hero-slider-dots">
                <button
                    type="button"
                    className={`hero-slider-dot ${currentSlide === 0 ? 'is-active' : ''}`}
                    onClick={() => setCurrentSlide(0)}
                    aria-label="Chuyển đến Slide 1"
                />
                <button
                    type="button"
                    className={`hero-slider-dot ${currentSlide === 1 ? 'is-active' : ''}`}
                    onClick={() => setCurrentSlide(1)}
                    aria-label="Chuyển đến Slide 2"
                />
            </div>
        </section>
    )
}

export default Hero
