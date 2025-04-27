import { MapPin, Clock, Phone, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock restaurant info
const getRestaurantInfo = (id: string) => ({
  id,
  address: "123 Main St, New York, NY 10001",
  phone: "(212) 555-1234",
  website: "www.burgerpalace.com",
  hours: [
    { day: "Monday", hours: "11:00 AM - 10:00 PM" },
    { day: "Tuesday", hours: "11:00 AM - 10:00 PM" },
    { day: "Wednesday", hours: "11:00 AM - 10:00 PM" },
    { day: "Thursday", hours: "11:00 AM - 10:00 PM" },
    { day: "Friday", hours: "11:00 AM - 11:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 11:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 9:00 PM" },
  ],
})

export function RestaurantInfo({ id }: { id: string }) {
  const info = getRestaurantInfo(id)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Restaurant Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
          <span>{info.address}</span>
        </div>

        <div className="flex items-start">
          <Phone className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
          <span>{info.phone}</span>
        </div>

        <div className="flex items-start">
          <Globe className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
          <span>{info.website}</span>
        </div>

        <div className="flex items-start">
          <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
          <div>
            <h4 className="font-medium mb-2">Hours</h4>
            <ul className="space-y-1 text-sm">
              {info.hours.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-medium">{item.day}</span>
                  <span className="text-muted-foreground">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
