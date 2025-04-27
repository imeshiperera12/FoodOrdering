import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Food Delivery Made <span className="text-primary">Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Order food from your favorite restaurants and enjoy the best delivery experience.
          </p>

          <div className="relative max-w-xl mx-auto">
            <div className="flex">
              <Input type="text" placeholder="Enter your delivery address" className="rounded-r-none h-12 pl-4 pr-12" />
              <Button className="rounded-l-none h-12">Find Food</Button>
            </div>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>Popular: New York, Brooklyn, Queens, Manhattan</p>
          </div>
        </div>
      </div>

      {/* Food image decorations */}
      <div className="hidden md:block absolute -bottom-10 left-10 w-32 h-32 rounded-full bg-white shadow-lg p-2">
        <div
          className="w-full h-full rounded-full bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.svg?height=120&width=120')" }}
        ></div>
      </div>

      <div className="hidden md:block absolute top-20 right-10 w-24 h-24 rounded-full bg-white shadow-lg p-2">
        <div
          className="w-full h-full rounded-full bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.svg?height=90&width=90')" }}
        ></div>
      </div>
    </section>
  )
}
