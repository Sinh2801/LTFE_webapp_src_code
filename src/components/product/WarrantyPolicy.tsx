import { Link } from 'react-router-dom'
import { WARRANTY_COVERED, WARRANTY_DAYS, WARRANTY_EXCLUDED, WARRANTY_STEPS } from '../../libs/warranty'

interface WarrantyPolicyProps {
    compact?: boolean
}


function WarrantyPolicy({ compact = false }: WarrantyPolicyProps) {
    return (
        <div className={compact ? 'warranty-policy warranty-policy--compact' : 'warranty-policy'}>
            <div className="warranty-highlight">
                <strong>{WARRANTY_DAYS} ngày</strong>
                <span>bảo hành kể từ ngày thanh toán thành công, áp dụng cho từng mã nguồn bạn đã mua.</span>
            </div>
            <div className="warranty-columns">
                <section>
                    <h3>Được bảo hành</h3>
                    <ul className="check-list">{WARRANTY_COVERED.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section>
                    <h3>Không thuộc phạm vi</h3>
                    <ul className="check-list check-list--no">{WARRANTY_EXCLUDED.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
            </div>
            {!compact && (
                <section>
                    <h3>Quy trình yêu cầu bảo hành</h3>
                    <ol className="warranty-steps">{WARRANTY_STEPS.map((step) => <li key={step}>{step}</li>)}</ol>
                    <p className="warranty-link"><Link to="/profile?tab=bao-hanh">Gửi yêu cầu bảo hành →</Link></p>
                </section>
            )}
        </div>
    )
}

export default WarrantyPolicy
