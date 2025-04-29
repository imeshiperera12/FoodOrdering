import axios from "axios"

const API_URL = "http://localhost:5009/api/location"

// Create axios instance with base URL
const locationApi = axios.create({
  baseURL: API_URL,
})

// Add token to requests if available
locationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAgentLocation = async (agentId: string) => {
  try {
    const response = await locationApi.get(`/${agentId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching location for agent ${agentId}:`, error)
    throw new Error("Failed to fetch agent location")
  }
}

export const updateAgentLocation = async (agentId: string, latitude: number, longitude: number) => {
  try {
    const response = await locationApi.post("/", { agentId, latitude, longitude })
    return response.data
  } catch (error) {
    console.error(`Error updating location for agent ${agentId}:`, error)
    throw new Error("Failed to update agent location")
  }
}

export const findNearestAgent = async (
  originLat: number,
  originLng: number,
  maxDistance = 5000,
  status = "available",
) => {
  try {
    const response = await locationApi.post("/nearest-agent", {
      originLat,
      originLng,
      maxDistance,
      status,
    })
    return response.data
  } catch (error) {
    throw new Error("Failed to find nearest agent")
  }
}

// Mock data for demonstration purposes
function getMockLocation(agentId: string) {
  // Generate random coordinates near a city center
  const baseLat = 40.7128 // New York City latitude
  const baseLng = -74.006 // New York City longitude

  // Add some random variation
  const lat = baseLat + (Math.random() - 0.5) * 0.05
  const lng = baseLng + (Math.random() - 0.5) * 0.05

  return {
    agentId,
    latitude: lat,
    longitude: lng,
    updatedAt: new Date().toISOString(),
  }
}
