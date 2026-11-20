
interface ReviewItem {
    quote: string
    author: string
    location: string
    avatarColor: string
    avatarChar: string
}

const REVIEWS_ROW_1: ReviewItem[] = [
    {
        quote: 'Mua source React bán hàng lúc 9h sáng, 10h đã dựng xong môi trường chạy thử. Code cấu trúc component rất sạch sẽ, hỗ trợ kỹ thuật nhiệt tình.',
        author: 'Thanh Tuấn',
        location: 'Thủ Đức,TP.HCM',
        avatarColor: '#f97316',
        avatarChar: 'T'
    },
    {
        quote: 'Mã nguồn Website Spa chất lượng vượt mong đợi, responsive chuẩn từng điểm ảnh. Tiết kiệm được ít nhất 2 tuần làm việc cho team mình.',
        author: 'Văn Tính',
        location: 'Phú Tân, AN Giang',
        avatarColor: '#8b5cf6',
        avatarChar: 'T'
    },
    {
        quote: 'Tải source game Cocos2dx về giải nén cài dependencies chạy ngay không lỗi lầm. Tài liệu hướng dẫn cài đặt DB chi tiết từng bước.',
        author: 'Võ Sinh',
        location: 'Tây Sơn, Bình Định',
        avatarColor: '#0ea5e9',
        avatarChar: 'S'
    },
    {
        quote: 'Hệ thống AI nhận diện bệnh lá chè dùng model DenseNet121 rất chuẩn xác. Thích nhất là có cả tài liệu giải thích kiến trúc API đi kèm.',
        author: 'Hoàng Quân',
        location: 'Trảng Bom, Đồng Nai',
        avatarColor: '#10b981',
        avatarChar: 'Q'
    },
    {
        quote: 'Giá thành hợp lý cho sinh viên và dev làm đồ án. Thanh toán xong nhận link tải mã nguồn tức thì, rất an tâm.',
        author: 'Gia Thuận',
        location: 'Trảng Bom, Đồng Nai',
        avatarColor: '#6366f1',
        avatarChar: 'T'
    },
    {
        quote: 'Giao diện mã nguồn được thiết kế rất đẹp, bố cục rõ ràng và dễ tùy chỉnh. Có tài liệu hướng dẫn nên mình triển khai nhanh hơn dự kiến.',
        author: 'Duy Đại',
        location: 'Tân Hiệp, TP.HCM',
        avatarColor: '#3b82f6',
        avatarChar: 'Đ'
    },
    {
        quote: 'Mình đánh giá cao chất lượng mã nguồn và cách tổ chức thư mục. Code khá dễ đọc, thuận tiện cho việc chỉnh sửa và phát triển thêm tính năng.',
        author: 'Trung Tiên',
        location: 'Thuận An, TP.HCM',
        avatarColor: '#8b5cf6',
        avatarChar: 'T'
    },
    {
        quote: 'Sản phẩm có giao diện hiện đại, chạy ổn định và đáp ứng tốt nhu cầu dự án. Đặc biệt phần hướng dẫn cài đặt khá chi tiết, rất hữu ích.',
        author: 'Ngọc Minh',
        location: 'Thủ Đức, TP.HCM',
        avatarColor: '#ec4899',
        avatarChar: 'M'
    }
]

const REVIEWS_ROW_2: ReviewItem[] = [
    {
        quote: 'Săn flash sale được bộ source code giá quá hời. Web chạy mượt, giao dịch thanh toán tự động tiện lợi.',
        author: 'Minh Thắng',
        location: 'Quy Nhơn, Bình Định',
        avatarColor: '#06b6d4',
        avatarChar: 'T'
    },
    {
        quote: 'Đội ngũ tư vấn kỹ càng, giải đáp đúng trọng tâm công nghệ mình đang cần. Chọn được đúng source code phù hợp dự án.',
        author: 'Ngọc Quang',
        location: 'Quận 9, TP.HCM',
        avatarColor: '#ec4899',
        avatarChar: 'Q'
    },
    {
        quote: 'Nhận source code ngay sau thanh toán, mã nguồn phân chia module MVC chuẩn chỉ. Sẽ tiếp tục ủng hộ SourceCodeTST lâu dài.',
        author: 'Minh Thiên',
        location: 'Thủ Đức, TP.HCM',
        avatarColor: '#eab308',
        avatarChar: 'T'
    },
    {
        quote: 'Đã mua 3 bộ source code ở đây, tất cả đều sạch mã độc, cài đặt dễ dàng theo hướng dẫn đính kèm trong file zip.',
        author: 'Danh Tài',
        location: 'Lái Thiêu,TP.HCM',
        avatarColor: '#ef4444',
        avatarChar: 'T'
    },
    {
        quote: 'Dịch vụ hậu mãi chu đáo, hỗ trợ giải đáp thắc mắc cấu hình database qua email rất nhanh.',
        author: 'Minh Quốc',
        location: 'Cái Bè,Đồng Tháp',
        avatarColor: '#14b8a6',
        avatarChar: 'Q'
    },
    {
        quote: 'Mã nguồn được đóng gói đầy đủ, cấu trúc dễ hiểu và có thể sử dụng làm nền tảng phát triển dự án riêng. Rất đáng để tham khảo.',
        author: 'Ngọc Trường',
        location: 'Bình Định',
        avatarColor: '#f59e0b',
        avatarChar: 'T'
    },
    {
        quote: 'Quá trình tìm kiếm và lựa chọn mã nguồn khá thuận tiện. Sản phẩm có thông tin rõ ràng, giúp mình tiết kiệm nhiều thời gian khi bắt đầu dự án.',
        author: 'Văn Thiệt',
        location: 'Long Xuyên, An Giang',
        avatarColor: '#10b981',
        avatarChar: 'T'
    },
    {
        quote: 'Mình thích cách trình bày sản phẩm chuyên nghiệp và dễ theo dõi. Mã nguồn có cấu trúc rõ ràng, phù hợp để học hỏi và phát triển ứng dụng.',
        author: 'Diệu Trung',
        location: 'Thủ Đức, TP.HCM',
        avatarColor: '#06b6d4',
        avatarChar: 'D'
    }
]

export function CustomerReviews() {
    return (
        <section className="home-section customer-reviews-section" id="danh-gia">
            <div className="customer-reviews-header">
                <div>
                    <span className="home-section__eyebrow">5.000+ KHÁCH HÀNG TIN DÙNG</span>
                    <h2>Khách hàng <span>nói gì về SourceCodeTST</span></h2>
                </div>
                <div className="customer-reviews-badge">
                    <span>★ 4.9/5</span> từ 1.200+ đánh giá
                </div>
            </div>

            <div className="reviews-marquee-wrapper">
                <div className="reviews-track reviews-track--left">
                    {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((review, idx) => (
                        <div key={`rev1-${idx}`} className="review-card">
                            <div className="review-card__stars">★★★★★</div>
                            <p className="review-card__quote">“{review.quote}”</p>
                            <div className="review-card__footer">
                                <div className="review-card__user">
                                    <span
                                        className="review-card__avatar"
                                        style={{ backgroundColor: review.avatarColor }}
                                    >
                                        {review.avatarChar}
                                    </span>
                                    <div>
                                        <h4 className="review-card__name">{review.author}</h4>
                                        <span className="review-card__loc">{review.location}</span>
                                    </div>
                                </div>
                                <span className="review-card__verified">✓ Đã mua</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="reviews-track reviews-track--right">
                    {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((review, idx) => (
                        <div key={`rev2-${idx}`} className="review-card">
                            <div className="review-card__stars">★★★★★</div>
                            <p className="review-card__quote">“{review.quote}”</p>
                            <div className="review-card__footer">
                                <div className="review-card__user">
                                    <span
                                        className="review-card__avatar"
                                        style={{ backgroundColor: review.avatarColor }}
                                    >
                                        {review.avatarChar}
                                    </span>
                                    <div>
                                        <h4 className="review-card__name">{review.author}</h4>
                                        <span className="review-card__loc">{review.location}</span>
                                    </div>
                                </div>
                                <span className="review-card__verified">✓ Đã mua</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CustomerReviews
