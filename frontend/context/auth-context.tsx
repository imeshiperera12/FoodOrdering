"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { login as loginApi, register as registerApi, getUserById } from "@/lib/api/auth-service"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  checkAuthStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (!token || !userData) {
        setUser(null)
        setIsLoading(false)
        return false
      }

      // Parse the stored user data
      const parsedUser = JSON.parse(userData)

      // Verify the token is still valid by making an API call
      try {
        // Get fresh user data from the API
        const freshUserData = await getUserById(parsedUser.id)

        // Update user with fresh data
        setUser({
          id: parsedUser.id,
          name: freshUserData.name || parsedUser.name,
          email: freshUserData.email || parsedUser.email,
          role: freshUserData.role || parsedUser.role,
          image: freshUserData.image || parsedUser.image,
        })

        setIsLoading(false)
        return true
      } catch (error) {
        // If API call fails, token might be invalid
        console.error("Token validation failed:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Auth status check failed:", error)
      setUser(null)
      setIsLoading(false)
      return false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password)
      const { token, user: userData } = response

      if (!token || !userData) {
        throw new Error("Invalid response from server")
      }

      // Store token and user data
      localStorage.setItem("token", token)

      // Create user object
      const userToStore = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        image: userData.image,
      }

      localStorage.setItem("user", JSON.stringify(userToStore))
      setUser(userToStore)

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      })

      // Redirect based on role
      if (userData.role === "admin") {
        router.push("/dashboard/admin")
      } else if (userData.role === "restaurant_admin") {
        router.push("/dashboard/restaurant")
      } else if (userData.role === "delivery_person") {
        router.push("/dashboard/delivery")
      } else {
        router.push("/restaurants")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      })
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      await registerApi(userData)
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      })
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
      })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
