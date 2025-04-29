"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function RestaurantDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear token storage and redirect to login
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    router.push("/auth/login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Restaurant Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">Welcome, Restaurant Admin! 🍽️</p>
          <Button className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
