"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Edit, Trash, Filter, FileDown, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for users
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    address: "123 Main St, New York, NY 10001",
    joinDate: "2023-01-15",
    status: "active",
    orders: 12,
    avatar: "/placeholder.svg?height=40&width=40",
    type: "customer",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(234) 567-8901",
    address: "456 Oak Ave, Brooklyn, NY 11201",
    joinDate: "2023-02-10",
    status: "active",
    orders: 8,
    avatar: "/placeholder.svg?height=40&width=40",
    type: "customer",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "(345) 678-9012",
    address: "789 Maple Rd, Queens, NY 11354",
    joinDate: "2023-03-05",
    status: "inactive",
    orders: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    type: "customer",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(456) 789-0123",
    address: "321 Pine St, Bronx, NY 10458",
    joinDate: "2023-04-20",
    status: "active",
    orders: 6,
    avatar: "/placeholder.svg?height=40&width=40",
    type: "admin",
  },
  {
    id: "5",
    name: "Alex Brown",
    email: "alex.brown@example.com",
    phone: "(567) 890-1234",
    address: "654 Cedar Blvd, Manhattan, NY 10016",
    joinDate: "2023-05-15",
    status: "active",
    orders: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    type: "restaurant_owner",
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesType = typeFilter === "all" || user.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "restaurant_owner":
        return <Badge className="bg-blue-500">Restaurant Owner</Badge>
      case "customer":
        return <Badge variant="outline">Customer</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">View and manage all users on your platform</p>
        </div>
        <Button>
          <FileDown className="h-4 w-4 mr-2" />
          Export Users
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-col sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="restaurant_owner">Restaurant Owner</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
                <TableCell>{getUserTypeBadge(user.type)}</TableCell>
                <TableCell className="hidden md:table-cell">{user.joinDate}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
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
