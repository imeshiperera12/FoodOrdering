"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"

interface DeliveryMapProps {
  deliveryLocation: {
    latitude: number
    longitude: number
  }
  destinationAddress: string
}

export default function DeliveryMap({ deliveryLocation, destinationAddress }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // This is a mock implementation since we can't load actual Google Maps in this environment
    // In a real implementation, you would use the Google Maps JavaScript API

    const initMap = () => {
      if (!mapRef.current) return

      try {
        // Simulate map loading
        setTimeout(() => {
          const canvas = document.createElement("canvas")
          canvas.width = mapRef.current?.clientWidth || 400
          canvas.height = mapRef.current?.clientHeight || 400
          canvas.style.width = "100%"
          canvas.style.height = "100%"

          if (mapRef.current) {
            // Clear any existing content
            while (mapRef.current.firstChild) {
              mapRef.current.removeChild(mapRef.current.firstChild)
            }

            mapRef.current.appendChild(canvas)

            // Draw a simple map representation on the canvas
            const ctx = canvas.getContext("2d")
            if (ctx) {
              // Draw background
              ctx.fillStyle = "#e5e7eb"
              ctx.fillRect(0, 0, canvas.width, canvas.height)

              // Draw some "roads"
              ctx.strokeStyle = "#ffffff"
              ctx.lineWidth = 6

              // Horizontal roads
              for (let i = 1; i < 5; i++) {
                ctx.beginPath()
                ctx.moveTo(0, (canvas.height * i) / 5)
                ctx.lineTo(canvas.width, (canvas.height * i) / 5)
                ctx.stroke()
              }

              // Vertical roads
              for (let i = 1; i < 5; i++) {
                ctx.beginPath()
                ctx.moveTo((canvas.width * i) / 5, 0)
                ctx.lineTo((canvas.width * i) / 5, canvas.height)
                ctx.stroke()
              }

              // Draw delivery location (red dot)
              const deliveryX = canvas.width * 0.7
              const deliveryY = canvas.height * 0.3
              ctx.fillStyle = "#ef4444"
              ctx.beginPath()
              ctx.arc(deliveryX, deliveryY, 10, 0, Math.PI * 2)
              ctx.fill()

              // Draw destination (green dot)
              const destinationX = canvas.width * 0.3
              const destinationY = canvas.height * 0.7
              ctx.fillStyle = "#22c55e"
              ctx.beginPath()
              ctx.arc(destinationX, destinationY, 10, 0, Math.PI * 2)
              ctx.fill()

              // Draw a path between them
              ctx.strokeStyle = "#3b82f6"
              ctx.lineWidth = 3
              ctx.setLineDash([5, 5])
              ctx.beginPath()
              ctx.moveTo(deliveryX, deliveryY)
              ctx.lineTo(destinationX, destinationY)
              ctx.stroke()

              // Add labels
              ctx.font = "14px Arial"
              ctx.fillStyle = "#000000"
              ctx.fillText("Delivery", deliveryX + 15, deliveryY)
              ctx.fillText("Destination", destinationX + 15, destinationY)
            }

            setIsLoading(false)
          }
        }, 1000)
      } catch (err) {
        setError("Failed to load map")
        setIsLoading(false)
      }
    }

    initMap()

    // In a real implementation, you would set up a listener for location updates
    // and update the map accordingly
  }, [deliveryLocation, destinationAddress])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin" />
            <span>Loading map...</span>
          </div>
        </div>
      )}
    </div>
  )
}
