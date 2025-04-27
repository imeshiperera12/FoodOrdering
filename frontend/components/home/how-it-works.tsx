import { Search, Utensils, Bike } from "lucide-react"

const steps = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Find Restaurants",
    description: "Browse through hundreds of restaurants near you",
  },
  {
    icon: <Utensils className="h-10 w-10 text-primary" />,
    title: "Choose Your Food",
    description: "Select from a variety of delicious meals",
  },
  {
    icon: <Bike className="h-10 w-10 text-primary" />,
    title: "Fast Delivery",
    description: "Get your food delivered to your doorstep quickly",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Order your favorite food in just a few simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-6 rounded-full mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
