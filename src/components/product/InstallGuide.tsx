import { buildInstallGuide } from '../../libs/installGuide'
import type { Product } from '../../libs/types'

function InstallGuide({ product }: { product: Pick<Product, 'technologies' | 'usage'> }) {
    const guide = buildInstallGuide(product)
    return (
        <div className="install-guide">
            <div className="install-guide__grid">
                <section>
                    <h3>Yêu cầu môi trường</h3>
                    <ul className="check-list">
                        {guide.requirements.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </section>
                <section>
                    <h3>Lưu ý khi cài đặt</h3>
                    <ul className="check-list check-list--tips">
                        {guide.tips.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </section>
            </div>
            <h3>Các bước cài đặt</h3>
            <ol className="install-steps">
                {guide.steps.map((step, index) => (
                    <li key={step.title}>
                        <span className="install-steps__no">{index + 1}</span>
                        <div>
                            <strong>{step.title}</strong>
                            <p>{step.detail}</p>
                            {step.command && <code>{step.command}</code>}
                        </div>
                    </li>
                ))}
            </ol>
            {product.usage && (
                <div className="install-note">
                    <strong>Hướng dẫn riêng của sản phẩm</strong>
                    <p>{product.usage}</p>
                </div>
            )}
        </div>
    )
}

export default InstallGuide
