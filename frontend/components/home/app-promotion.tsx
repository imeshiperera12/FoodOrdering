import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AppPromotion() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Get the FoodHub App</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Download our mobile app for a better experience. Track your orders in real-time, get exclusive offers, and
              more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5,2H8.5L3,7V22H21V7L17.5,2M16.92,3L20.09,6.17H16.92V3M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,17C13.33,17 16,17.67 16,19V21H8V19C8,17.67 10.67,17 12,17Z" />
                </svg>
                App Store
              </Button>
              <Button className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Google Play
              </Button>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="FoodHub Mobile App"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
