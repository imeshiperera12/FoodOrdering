import { HeroSection } from "@/components/home/hero-section"
import { FeaturedRestaurants } from "@/components/home/featured-restaurants"
import { HowItWorks } from "@/components/home/how-it-works"
import { AppPromotion } from "@/components/home/app-promotion"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedRestaurants />
        <HowItWorks />
        <AppPromotion />
      </main>
      <Footer />
    </div>
  )
}
