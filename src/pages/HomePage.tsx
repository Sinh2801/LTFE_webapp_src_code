import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hook'
import { fetchCategories } from '../app/slices/categorySlice'
import { fetchFeatured } from '../app/slices/productSlice'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedSection from '../components/home/FeaturedSection'
import Hero from '../components/home/Hero'
import HowItWorks from '../components/home/HowItWorks'
import SellerBanner from '../components/home/SellerBanner'

function HomePage() {
    const dispatch = useAppDispatch()
    const categories = useAppSelector((state) => state.categories)
    const products = useAppSelector((state) => state.products)

    useEffect(() => {
        dispatch(fetchCategories())
        dispatch(fetchFeatured())
    }, [dispatch])

    return (
        <main className="home-page">
            <Hero />
            <CategoryGrid
                categories={categories.items}
                status={categories.status}
                error={categories.error}
                onRetry={() => dispatch(fetchCategories())}
            />
            <FeaturedSection
                products={products.featured}
                status={products.featuredStatus}
                error={products.error}
                onRetry={() => dispatch(fetchFeatured())}
            />
            <HowItWorks />
            <SellerBanner />
        </main>
    )
}

export default HomePage
