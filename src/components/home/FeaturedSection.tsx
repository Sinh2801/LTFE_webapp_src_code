import { Link } from 'react-router-dom'
import type { Product } from '../../libs/types'
import spotlightImg1 from '../../assets/spotlight-slot-1.jpg'
import spotlightImg5 from '../../assets/spotlight-slot-5.png'
import spotlightImg3 from '../../assets/spotlight-slot-3.jpg'
import spotlightImg4 from '../../assets/spotlight-slot-4.jpg'
import pokemonVideo from '../../assets/pokemon.mp4'

interface FeaturedSectionProps {
    products?: Product[]
    status?: 'idle' | 'loading' | 'succeeded' | 'failed'
    error?: string | null
    onRetry?: () => void
}

function FeaturedSection(_props: FeaturedSectionProps) {
    return (
        <section className="home-section home-featured">
            <div className="home-section__heading home-featured-heading">
                <div>
                    <span className="home-section__eyebrow">SPOTLIGHT</span>
                    <h2>Siêu phẩm <span>đáng mua nhất</span></h2>
                </div>
                <Link className="home-category-all" to="/products">
                    Xem tất cả <span aria-hidden="true">→</span>
                </Link>
            </div>

            <div className="spotlight-bento-container">
                <div className="spotlight-column spotlight-column--left">
                    <div className="spotlight-slot spotlight-slot--hero">
                        <img src={spotlightImg1} alt="Website Quán Cà Phê & Đồ Uống T1 Brew" className="spotlight-slot__bg" />
                        <div className="spotlight-slot__overlay"></div>
                        <div className="spotlight-slot__badge">
                            <span className="spotlight-dot"></span> BEST SELLER #1
                        </div>
                        <div className="spotlight-slot__content">
                            <h3>Website Cà Phê T1 Brew</h3>
                            <p>Full source code website thương hiệu đồ uống & cà phê, đặt món nhanh, tối ưu trải nghiệm cao cấp.</p>
                            <div className="spotlight-slot__price">Từ <strong>2.000.000đ</strong></div>
                            <Link to="/products" className="spotlight-btn">Mua ngay →</Link>
                        </div>
                    </div>

                    <div className="spotlight-slot spotlight-slot--bottom-left">
                        <img src={spotlightImg5} alt="TeaLeaf AI - Hệ Thống Trí Tuệ Nhân Tạo Nhận Diện Bệnh Lá Chè" className="spotlight-slot__bg spotlight-slot__bg--right" />
                        <div className="spotlight-slot__overlay spotlight-slot__overlay--left"></div>
                        <div className="spotlight-slot__badge spotlight-slot__badge--ai">
                            AI MODEL
                        </div>
                        <div className="spotlight-slot__content">
                            <h3>TeaLeaf AI – Nhận Diện Bệnh Lá Chè</h3>
                            <p>Mô hình Deep Learning nhận diện bệnh cây trồng chính xác 91.5%, chuẩn đoán nhanh từ camera & file ảnh.</p>
                            <div className="spotlight-slot__price spotlight-slot__price--yellow">Từ <strong>1.490.000đ</strong></div>
                        </div>
                    </div>
                </div>

                <div className="spotlight-column spotlight-column--right">
                    <div className="spotlight-top-mini-row">
                        <div className="spotlight-slot spotlight-slot--square-1">
                            <img src={spotlightImg3} alt="EGA Bike - Giao Diện Bán Xe Đạp & Phụ Kiện" className="spotlight-slot__bg" />
                            <div className="spotlight-slot__overlay spotlight-slot__overlay--square"></div>
                            <div className="spotlight-slot__content">
                                <h3>App EGA Bike</h3>
                                <div className="spotlight-slot__price spotlight-slot__price--yellow">2.800.000đ</div>
                            </div>
                        </div>

                        <div className="spotlight-slot spotlight-slot--square-2">
                            <img src={spotlightImg4} alt="IP Camera Manager - Phần Mềm Quản Lý Camera" className="spotlight-slot__bg" />
                            <div className="spotlight-slot__overlay spotlight-slot__overlay--square"></div>
                            <div className="spotlight-slot__content">
                                <h3>IP Camera Manager</h3>
                                <div className="spotlight-slot__price spotlight-slot__price--yellow">1.850.000đ</div>
                            </div>
                        </div>
                    </div>

                    <div className="spotlight-slot spotlight-slot--video-large">
                        <video
                            className="spotlight-slot__video"
                            src={pokemonVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                        <div className="spotlight-slot__overlay spotlight-slot__overlay--video"></div>
                        <a
                            href="https://drive.google.com/file/d/1uuWMeE-jjbEfxQz2d4-YXTDT8giA3Ekl/view"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spotlight-badge-video spotlight-badge-video--link"
                            title="Xem video trên Google Drive"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            Video ↗
                        </a>
                        <div className="spotlight-slot__content">
                            <h3>Source Game Mobile Pokemon Tân Thần Thú</h3>
                            <p>Fullsource game đầy đủ Cocos2dx, Server Java, SQL, hỗ trợ Android & iOS.</p>
                            <div className="spotlight-slot__bottom-row">
                                <span className="spotlight-slot__price spotlight-slot__price--yellow">500.000đ</span>
                                <Link to="/products" className="spotlight-btn spotlight-btn--outline">Khám phá →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturedSection
