import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { selectIsOwned } from '../../app/slices/librarySlice'
import { fetchReviews } from '../../app/slices/reviewSlice'
import { Stars } from '../common/Stars'
import RatingSummary from './RatingSummary'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'
import { formatDate } from '../../libs/format'
import type { Product } from '../../libs/types'

function ReviewSection({ product }: { product: Product }) {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const user = useAppSelector((state) => state.auth.user)
    const owned = useAppSelector(selectIsOwned(product.id))
    const libraryStatus = useAppSelector((state) => state.library.status)
    const { summary, status, error } = useAppSelector((state) => state.reviews)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        dispatch(fetchReviews(product.id))
    }, [dispatch, product.id, user?.id])

    const mine = summary?.mine ?? null

    return (
        <section className="review-section" id="danh-gia">
            <div className="review-section__head">
                <div>
                    <span className="home-section__eyebrow">ĐÁNH GIÁ TỪ KHÁCH HÀNG</span>
                    <h2>Khách hàng nói gì về sản phẩm này</h2>
                </div>
            </div>

            {status === 'loading' && !summary && <div className="loading"><span className="loading__spinner" />Đang tải đánh giá...</div>}
            {status === 'failed' && !summary && (
                <div className="catalog-empty">
                    <h3>Chưa tải được đánh giá</h3>
                    <p>{error}</p>
                    <button type="button" onClick={() => dispatch(fetchReviews(product.id))}>Thử lại</button>
                </div>
            )}

            {summary && (
                <div className="review-section__layout">
                    <aside>
                        <RatingSummary summary={summary} />
                        <div className="review-gate">
                            {!user && (
                                <>
                                    <h3>Bạn đã mua sản phẩm này?</h3>
                                    <p>Đăng nhập để chia sẻ đánh giá của bạn.</p>
                                    <Link className="btn-solid" to="/login" state={{ from: `${location.pathname}?tab=danh-gia` }}>Đăng nhập</Link>
                                </>
                            )}
                            {user && !owned && libraryStatus === 'loading' && <p>Đang kiểm tra quyền đánh giá...</p>}
                            {user && !owned && libraryStatus !== 'loading' && (
                                <>
                                    <h3>Đánh giá dành cho khách đã mua</h3>
                                    <p>Mua sản phẩm này để chia sẻ trải nghiệm. Điều đó giúp mọi đánh giá đều đáng tin cậy.</p>
                                </>
                            )}
                            {user && owned && !mine && !editing && (
                                <>
                                    <h3>Bạn đã sở hữu sản phẩm này</h3>
                                    <p>Chia sẻ trải nghiệm để giúp người mua sau chọn đúng mã nguồn.</p>
                                    <button type="button" className="btn-solid" onClick={() => setEditing(true)}>Viết đánh giá</button>
                                </>
                            )}
                            {user && owned && mine && !editing && (
                                <div className="review-mine">
                                    <h3>Đánh giá của bạn</h3>
                                    <Stars value={mine.rating} size={18} />
                                    {mine.comment && <p>{mine.comment}</p>}
                                    <small>{formatDate(mine.updatedAt ?? mine.createdAt)}</small>
                                    <button type="button" className="btn-ghost" onClick={() => setEditing(true)}>Chỉnh sửa</button>
                                </div>
                            )}
                        </div>
                    </aside>
                    <div>
                        {user && owned && editing && (
                            <ReviewForm productId={product.id} existing={mine} onClose={() => setEditing(false)} />
                        )}
                        <ReviewList items={summary.items} mineId={mine?.id} />
                    </div>
                </div>
            )}
        </section>
    )
}

export default ReviewSection
