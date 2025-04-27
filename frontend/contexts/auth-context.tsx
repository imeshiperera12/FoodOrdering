"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

type User = {
  _id: string
  name: string
  email: string
  role: "customer" | "restaurant_owner" | "admin" | "delivery_person"
  phone?: string
  address?: string
  favorites?: string[]
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateProfile: (userData: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (token && userId) {
      setIsLoading(true)
      authAPI
        .getUserById(userId)
        .then((userData) => {
          setUser(userData)
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(email, password)
      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", response.user._id)
      setUser(response.user)
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      })
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      const response = await authAPI.register(userData)
      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", response.user._id)
      setUser(response.user)
      toast({
        title: "Registration successful",
        description: `Welcome, ${response.user.name}!`,
      })
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const updateProfile = async (userData: any) => {
    setIsLoading(true)
    try {
      const updatedUser = await authAPI.updateProfile(userData)
      setUser(updatedUser)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })
    } catch (error) {
      console.error("Profile update failed:", error)
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
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
