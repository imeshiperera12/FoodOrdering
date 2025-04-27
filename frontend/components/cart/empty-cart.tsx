import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-muted rounded-full p-6 mb-6">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Looks like you haven't added any items to your cart yet. Browse our restaurants and add some delicious food!
      </p>
      <Button asChild>
        <Link href="/restaurants">Browse Restaurants</Link>
      </Button>
    </div>
  )
}
