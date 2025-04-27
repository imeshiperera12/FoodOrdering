import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartItems } from "@/components/cart/cart-items"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"

export default function CartPage() {
  // In a real app, we would check if cart is empty
  const isCartEmpty = false

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {isCartEmpty ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <CartItems />
            </div>
            <div className="w-full lg:w-1/3">
              <CartSummary />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
