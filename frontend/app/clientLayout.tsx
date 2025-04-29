"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import "./globals.css"
import { NotificationProvider } from "@/context/notification-context"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

function MainLayout({ children }) {
  const pathname = usePathname()

  // Don't show header and footer on dashboard pages
  const isDashboardPage = pathname?.startsWith("/dashboard")

  if (isDashboardPage) {
    return children
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                <MainLayout>{children}</MainLayout>
                <Toaster />
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
