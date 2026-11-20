import { Fragment } from 'react'
import step1Img from '../../assets/step-1.png'
import step2Img from '../../assets/step-2.png'
import step3Img from '../../assets/step-3.png'

export interface HowItWorksStep {
    number: string
    title: string
    description: string
    image?: string
    imageAlt?: string
}

const steps: HowItWorksStep[] = [
    {
        number: '01',
        title: 'Chọn mã nguồn',
        description: 'Tìm sản phẩm theo danh mục và công nghệ phù hợp.',
        image: step1Img,
        imageAlt: 'Minh họa chọn mã nguồn',
    },
    {
        number: '02',
        title: 'Thanh toán',
        description: 'Thêm sản phẩm vào giỏ và hoàn tất thanh toán.',
        image: step2Img,
        imageAlt: 'Minh họa thanh toán',
    },
    {
        number: '03',
        title: 'Bắt đầu sử dụng',
        description: 'Xem hướng dẫn và tải mã nguồn sau khi mua.',
        image: step3Img,
        imageAlt: 'Minh họa bắt đầu sử dụng',
    },
]

function HowItWorks() {
    return (
        <section className="home-section home-how-it-works" id="how-it-works">
            <div className="home-section__heading home-section__heading--center">
                <div>
                    <span className="home-section__eyebrow">BẮT ĐẦU ĐƠN GIẢN</span>
                    <h2>Mua mã nguồn trong <span>3 bước</span></h2>
                </div>
            </div>
            <div className="home-steps">
                {steps.map((step, index) => (
                    <Fragment key={step.number}>
                        <article className="home-step">
                            <div className="home-step__left">
                                <div className="home-step__badge-wrap">
                                    <span className="home-step__number">{step.number}</span>
                                </div>
                                <div className="home-step__body">
                                    <h3 className="home-step__title">{step.title}</h3>
                                    <p className="home-step__description">{step.description}</p>
                                </div>
                            </div>
                            <div className="home-step__image-container">
                                {step.image ? (
                                    <img
                                        src={step.image}
                                        alt={step.imageAlt || step.title}
                                        className="home-step__img"
                                    />
                                ) : (
                                    <div className="home-step__placeholder" aria-label={`Vùng hình ảnh cho bước ${step.number}`}>
                                        <svg
                                            className="home-step__placeholder-icon"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                        <span className="home-step__placeholder-text">Vùng hình ảnh</span>
                                    </div>
                                )}
                            </div>
                        </article>
                        {index < steps.length - 1 && (
                            <div className="home-step-arrow" aria-hidden="true">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="13 17 18 12 13 7" />
                                    <polyline points="6 17 11 12 6 7" />
                                </svg>
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </section>
    )
}

export default HowItWorks
