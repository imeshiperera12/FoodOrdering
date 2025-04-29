"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { addMenuItem } from "@/lib/api/restaurant-service"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

const categories = ["Appetizers", "Main Course", "Desserts", "Beverages", "Sides", "Specials"]

export default function AddMenuItemPage() {
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
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

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
        description: "Please login to add menu items",
        variant: "destructive",
      })
      router.push("/login?redirect=/dashboard/restaurant/menu/add")
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

      await addMenuItem(restaurantId, {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        isAvailable: formData.isAvailable,
        specialNotes: formData.specialNotes,
      })

      toast({
        title: "Menu item added",
        description: "The menu item has been successfully added to your restaurant.",
      })

      router.push("/dashboard/restaurant/menu")
    } catch (error) {
      console.error("Error adding menu item:", error)
      toast({
        title: "Failed to add menu item",
        description: "There was an error adding the menu item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Add Menu Item</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Menu Item Details</CardTitle>
              <CardDescription>Add a new item to your restaurant menu</CardDescription>
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
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Menu Item"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
