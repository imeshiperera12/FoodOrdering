import type React from "react"
import ClientLayout from "./clientLayout"

export const metadata = {
  title: "FoodHub - Food Ordering System",
  description: "A complete food ordering and delivery platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'