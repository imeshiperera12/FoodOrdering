import axios from "axios"

const API_URL = "http://localhost:5007/api/auth"

// Create axios instance with base URL
const authApi = axios.create({
  baseURL: API_URL,
})

// Add token to requests if available
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (email: string, password: string) => {
  try {
    const response = await authApi.post("/login", { email, password })
    return response.data
  } catch (error) {
    console.error("Login failed:", error)
    throw new Error("Login failed")
  }
}

export const register = async (userData: any) => {
  try {
    const response = await authApi.post("/register", userData)
    return response.data
  } catch (error) {
    console.error("Registration failed:", error)
    throw new Error("Registration failed")
  }
}

export const getUserById = async (userId: string) => {
  try {
    const response = await authApi.get(`/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error)
    throw new Error("Failed to fetch user")
  }
}

export const updateProfile = async (profileData: any) => {
  try {
    const response = await authApi.put("/profile", profileData)
    return response.data
  } catch (error) {
    console.error("Profile update failed:", error)
    throw new Error("Profile update failed")
  }
}

export const getFavoriteRestaurants = async () => {
  try {
    const response = await authApi.get("/favorites")
    return response.data
  } catch (error) {
    console.error("Failed to fetch favorite restaurants:", error)
    throw new Error("Failed to fetch favorite restaurants")
  }
}

export const addToFavorites = async (restaurantId: string) => {
  try {
    const response = await authApi.post("/favorites", { restaurantId })
    return response.data
  } catch (error) {
    console.error(`Failed to add restaurant ${restaurantId} to favorites:`, error)
    throw new Error("Failed to add restaurant to favorites")
  }
}

export const removeFromFavorites = async (restaurantId: string) => {
  try {
    const response = await authApi.delete(`/favorites/${restaurantId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to remove restaurant ${restaurantId} from favorites:`, error)
    throw new Error("Failed to remove restaurant from favorites")
  }
}

export const getAllUsers = async () => {
  try {
    const response = await authApi.get("/users")
    return response.data
  } catch (error) {
    console.error("Failed to fetch all users:", error)
    throw new Error("Failed to fetch users")
  }
}

export const updateUserStatus = async (userId: string, isActive: boolean) => {
  try {
    const response = await authApi.patch(`/users/${userId}/status`, { isActive })
    return response.data
  } catch (error) {
    console.error(`Failed to update status for user ${userId}:`, error)
    throw new Error("Failed to update user status")
  }
}
