import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { OrderSummary } from "@/components/checkout/order-summary"

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <CheckoutForm />
          </div>
          <div className="w-full lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
