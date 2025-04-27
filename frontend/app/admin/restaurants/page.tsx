"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Edit, Trash, Star, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for restaurants
const restaurants = [
  {
    id: "1",
    name: "Burger Palace",
    owner: "John Smith",
    address: "123 Main St, New York, NY 10001",
    status: "active",
    featured: true,
    rating: 4.8,
    cuisine: "American",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Pizza Heaven",
    owner: "Jane Doe",
    address: "456 Oak Ave, Brooklyn, NY 11201",
    status: "active",
    featured: true,
    rating: 4.6,
    cuisine: "Italian",
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Sushi World",
    owner: "Mike Chen",
    address: "789 Maple Rd, Queens, NY 11354",
    status: "active",
    featured: true,
    rating: 4.9,
    cuisine: "Japanese",
    joinDate: "2023-03-05",
  },
  {
    id: "4",
    name: "Taco Fiesta",
    owner: "Carlos Rodriguez",
    address: "321 Pine St, Bronx, NY 10458",
    status: "active",
    featured: false,
    rating: 4.7,
    cuisine: "Mexican",
    joinDate: "2023-04-12",
  },
  {
    id: "5",
    name: "Curry Spice",
    owner: "Raj Patel",
    address: "654 Cedar Blvd, Manhattan, NY 10016",
    status: "inactive",
    featured: false,
    rating: 4.4,
    cuisine: "Indian",
    joinDate: "2023-05-18",
  },
]

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || restaurant.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
          <p className="text-muted-foreground">Manage the restaurants on your platform</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Restaurant</DialogTitle>
              <DialogDescription>Enter the details of the new restaurant to add it to your platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="owner" className="text-right">
                  Owner
                </Label>
                <Input id="owner" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cuisine" className="text-right">
                  Cuisine
                </Label>
                <Input id="cuisine" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input id="address" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Restaurant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 flex-col sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search restaurants..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="hidden md:table-cell">Cuisine</TableHead>
              <TableHead className="hidden md:table-cell">Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRestaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell className="font-medium">{restaurant.name}</TableCell>
                <TableCell>{restaurant.owner}</TableCell>
                <TableCell className="hidden md:table-cell">{restaurant.cuisine}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    {restaurant.rating}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={restaurant.status === "active" ? "default" : "secondary"}>
                    {restaurant.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{restaurant.featured ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
