"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { fetchRestaurantById, updateMenuItem } from "@/lib/api/restaurant-service"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { ArrowLeft } from "lucide-react"

const categories = ["Appetizers", "Main Course", "Desserts", "Beverages", "Sides", "Specials"]

export default function EditMenuItemPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
    specialNotes: "",
  })
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "restaurant_admin") {
      toast({
        title: "Access denied",
        description: "You don't have permission to edit menu items.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    const fetchMenuItem = async () => {
      try {
        setIsFetching(true)
        // In a real app, you would get the restaurant ID from the user's profile
        const restaurantId = user.restaurantId || "680c9283a5f8ad21fdfd9693" // Fallback for demo
        const menuItemId = params.id

        const restaurantData = await fetchRestaurantById(restaurantId)
        const item = restaurantData.menu.find((item) => item._id === menuItemId)

        if (!item) {
          toast({
            title: "Menu item not found",
            description: "The menu item you're trying to edit could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard/restaurant/menu")
          return
        }

        setFormData({
          name: item.name,
          description: item.description || "",
          price: item.price.toString(),
          category: item.category,
          image: item.image || "",
          isAvailable: item.isAvailable,
          specialNotes: item.specialNotes || "",
        })
      } catch (error) {
        console.error("Error fetching menu item:", error)
        toast({
          title: "Failed to fetch menu item",
          description: "There was an error loading the menu item. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard/restaurant/menu")
      } finally {
        setIsFetching(false)
      }
    }

    fetchMenuItem()
  }, [user, router, toast, params.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isAvailable: checked }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to edit menu items",
        variant: "destructive",
      })
      router.push("/login?redirect=/dashboard/restaurant/menu")
      return
    }

    // Validate form
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // In a real app, you would get the restaurant ID from the user's profile
      const restaurantId = user.restaurantId || "680c9283a5f8ad21fdfd9693" // Fallback for demo
      const menuItemId = params.id

      await updateMenuItem(restaurantId, menuItemId, {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        isAvailable: formData.isAvailable,
        specialNotes: formData.specialNotes,
      })

      toast({
        title: "Menu item updated",
        description: "The menu item has been successfully updated.",
      })

      router.push("/dashboard/restaurant/menu")
    } catch (error) {
      console.error("Error updating menu item:", error)
      toast({
        title: "Failed to update menu item",
        description: "There was an error updating the menu item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <Button variant="outline" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>

        <h1 className="text-3xl font-bold mb-6">Edit Menu Item</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Menu Item Details</CardTitle>
              <CardDescription>Update the details of your menu item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Chicken Biryani"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your menu item..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="e.g., https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialNotes">Special Notes</Label>
                <Textarea
                  id="specialNotes"
                  name="specialNotes"
                  placeholder="Any special instructions or notes..."
                  value={formData.specialNotes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="isAvailable">Available</Label>
                <Switch id="isAvailable" checked={formData.isAvailable} onCheckedChange={handleSwitchChange} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Menu Item"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
