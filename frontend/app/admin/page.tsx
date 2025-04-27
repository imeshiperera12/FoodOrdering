import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Users, ShoppingBag, Store, Truck, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your food delivery platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                20.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+124</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowDown className="h-3 w-3 mr-1" />
                4.5%
              </span>
              from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Restaurants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                12.2%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">621</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                8.3%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((order) => (
                <div key={order} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">Order #{Math.floor(Math.random() * 10000)}</p>
                    <p className="text-sm text-muted-foreground">
                      {
                        ["Burger Palace", "Pizza Heaven", "Sushi World", "Taco Fiesta", "Curry Spice"][
                          Math.floor(Math.random() * 5)
                        ]
                      }
                    </p>
                  </div>
                  <Badge>
                    {["Processing", "Delivered", "Out for delivery", "Preparing"][Math.floor(Math.random() * 4)]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((user) => (
                <div key={user} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {
                        ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Alex Brown"][
                          Math.floor(Math.random() * 5)
                        ]
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Joined {Math.floor(Math.random() * 24)} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
