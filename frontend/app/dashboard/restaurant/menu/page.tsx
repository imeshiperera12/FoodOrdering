"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { fetchRestaurantById, deleteMenuItem } from "@/lib/api/restaurant-service"
import DashboardLayout from "@/components/dashboard-layout"
import { Edit, MoreVertical, Plus, Trash } from "lucide-react"

export default function MenuPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [menuItems, setMenuItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "restaurant_admin") {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    const fetchMenuItems = async () => {
      try {
        setIsLoading(true)
        // In a real app, you would get the restaurant ID from the user's profile
        const restaurantId = user.restaurantId || "680c9283a5f8ad21fdfd9693" // Fallback for demo
        const restaurantData = await fetchRestaurantById(restaurantId)
        setMenuItems(restaurantData.menu || [])
      } catch (error) {
        console.error("Error fetching menu items:", error)
        toast({
          title: "Failed to load menu items",
          description: "There was an error loading your menu items. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenuItems()
  }, [user, router, toast])

  const handleDeleteMenuItem = async () => {
    if (!itemToDelete) return

    try {
      // In a real app, you would get the restaurant ID from the user's profile
      const restaurantId = user.restaurantId || "680c9283a5f8ad21fdfd9693" // Fallback for demo
      await deleteMenuItem(restaurantId, itemToDelete)

      setMenuItems(menuItems.filter((item) => item._id !== itemToDelete))
      toast({
        title: "Menu item deleted",
        description: "The menu item has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting menu item:", error)
      toast({
        title: "Failed to delete menu item",
        description: "There was an error deleting the menu item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setItemToDelete(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Menu Items</h1>
          <Button asChild>
            <Link href="/dashboard/restaurant/menu/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground mb-4">You don't have any menu items yet.</p>
                <Button asChild>
                  <Link href="/dashboard/restaurant/menu/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Menu Item
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-10 w-10 rounded-md object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=40&width=40"
                              }}
                            />
                          )}
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/restaurant/menu/edit/${item._id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the menu item.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => setItemToDelete(item._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
