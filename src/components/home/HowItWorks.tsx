const steps = [
    { number: '01', title: 'Chọn mã nguồn', description: 'Tìm sản phẩm theo danh mục và công nghệ phù hợp.' },
    { number: '02', title: 'Thanh toán', description: 'Thêm sản phẩm vào giỏ và hoàn tất thanh toán.' },
    { number: '03', title: 'Bắt đầu sử dụng', description: 'Xem hướng dẫn và tải mã nguồn sau khi mua.' },
]

function HowItWorks() {
    return (
        <section className="home-section home-how-it-works" id="how-it-works">
            <div className="home-section__heading home-section__heading--center">
                <div>
                    <span className="home-section__eyebrow">BẮT ĐẦU ĐƠN GIẢN</span>
                    <h2>Mua mã nguồn trong 3 bước</h2>
                </div>
            </div>
            <div className="home-steps">
                {steps.map((step) => (
                    <article className="home-step" key={step.number}>
                        <span className="home-step__number">{step.number}</span>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default HowItWorks
