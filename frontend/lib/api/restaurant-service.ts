import axios from "axios"

const API_URL = "http://localhost:5008/api/restaurant"

// Create axios instance with base URL
const restaurantApi = axios.create({
  baseURL: API_URL,
})

// Automatically add token from localStorage if available
restaurantApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const fetchRestaurants = async (filters = {}) => {
  try {
    // Convert filters object to query string
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value as string)
    })

    const response = await restaurantApi.get(`?${queryParams.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    throw new Error("Failed to fetch restaurants")
  }
}

export const fetchRestaurantById = async (id: string) => {
  try {
    const response = await restaurantApi.get(`/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error)
    throw new Error("Failed to fetch restaurant")
  }
}

export const createRestaurant = async (restaurantData: any) => {
  try {
    const response = await restaurantApi.post("/", restaurantData)
    return response.data
  } catch (error) {
    console.error("Error creating restaurant:", error)
    throw new Error("Failed to create restaurant")
  }
}

export const setRestaurantAvailability = async (restaurantId: string, isAvailable: boolean) => {
  try {
    const response = await restaurantApi.patch(`/${restaurantId}/availability`, { isAvailable })
    return response.data
  } catch (error) {
    console.error(`Error updating restaurant availability for ID ${restaurantId}:`, error)
    throw new Error("Failed to update restaurant availability")
  }
}

export const verifyRestaurant = async (restaurantId: string) => {
  try {
    const response = await restaurantApi.patch(`/${restaurantId}/verify`)
    return response.data
  } catch (error) {
    console.error(`Error verifying restaurant with ID ${restaurantId}:`, error)
    throw new Error("Failed to verify restaurant")
  }
}

// Menu Item Operations
export const addMenuItem = async (restaurantId: string, menuItemData: any) => {
  try {
    const response = await restaurantApi.post(`/${restaurantId}/menu`, menuItemData)
    return response.data
  } catch (error) {
    console.error(`Error adding menu item to restaurant ${restaurantId}:`, error)
    throw new Error("Failed to add menu item")
  }
}

export const updateMenuItem = async (restaurantId: string, itemId: string, menuItemData: any) => {
  try {
    const response = await restaurantApi.put(`/${restaurantId}/menu/${itemId}`, menuItemData)
    return response.data
  } catch (error) {
    console.error(`Error updating menu item ${itemId} for restaurant ${restaurantId}:`, error)
    throw new Error("Failed to update menu item")
  }
}

export const deleteMenuItem = async (restaurantId: string, itemId: string) => {
  try {
    const response = await restaurantApi.delete(`/${restaurantId}/menu/${itemId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting menu item ${itemId} from restaurant ${restaurantId}:`, error)
    throw new Error("Failed to delete menu item")
  }
}
