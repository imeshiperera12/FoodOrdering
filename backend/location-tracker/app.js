import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Location from "./models/Location.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

mongoose
  .connect(
    "mongodb+srv://imeshiperera18:Imeshi200014*@foodorder.6csf07w.mongodb.net/TrackingDB"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

io.on("connection", (socket) => {
  console.log("🚚 Agent connected:", socket.id);

  socket.on("locationUpdate", async (data) => {
    const { agentId, latitude, longitude } = data;
    console.log("📍 Updating location:", agentId, latitude, longitude);

    await Location.findOneAndUpdate(
      { agentId },
      { latitude, longitude, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    // Send real-time update to all clients
    io.emit("locationBroadcast", { agentId, latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log("❌ Agent disconnected:", socket.id);
  });
});

app.get("/api/location/:agentId", async (req, res) => {
  try {
    const location = await Location.findOne({ agentId: req.params.agentId });
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.status(200).json(location);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching location", error: err.message });
  }
});

//new routes
// Add this to the location-tracker's app.js
app.post("/api/location", async (req, res) => {
  try {
    const { agentId, latitude, longitude } = req.body;

    const location = await Location.findOneAndUpdate(
      { agentId },
      { latitude, longitude, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    // Broadcast to all connected clients
    io.emit("locationBroadcast", { agentId, latitude, longitude });

    res.status(200).json(location);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating location", error: err.message });
  }
});

// // Add endpoint to find nearest available delivery person
// app.post("/api/nearest-agent", async (req, res) => {
//   try {
//     const {
//       originLat,
//       originLng,
//       maxDistance = 5000,
//       status = "available",
//     } = req.body;

//     // Find all delivery agents with recent location updates (active in last 10 minutes)
//     const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//     const agents = await Location.find({
//       updatedAt: { $gte: tenMinutesAgo },
//     });

//     if (agents.length === 0) {
//       return res.status(404).json({ message: "No active agents found" });
//     }

//     // Calculate distances and find nearest
//     let nearestAgent = null;
//     let shortestDistance = Infinity;

//     for (const agent of agents) {
//       // Check if the agent is available in the user service
//       try {
//         const { data } = await axios.get(
//           `http://user-service:5002/api/users/${agent.agentId}/status`
//         );
//         if (data.status !== status) continue;

//         // Calculate distance using Haversine formula
//         const distance = calculateDistance(
//           originLat,
//           originLng,
//           agent.latitude,
//           agent.longitude
//         );

//         if (distance < shortestDistance && distance <= maxDistance) {
//           shortestDistance = distance;
//           nearestAgent = agent;
//         }
//       } catch (error) {
//         console.error(
//           `Error checking agent ${agent.agentId} status:`,
//           error.message
//         );
//       }
//     }

//     if (!nearestAgent) {
//       return res
//         .status(404)
//         .json({ message: "No available agents within range" });
//     }

//     res.status(200).json({
//       agentId: nearestAgent.agentId,
//       distance: shortestDistance,
//       location: {
//         latitude: nearestAgent.latitude,
//         longitude: nearestAgent.longitude,
//       },
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error finding nearest agent", error: err.message });
//   }
// });

// // Helper function to calculate distance between two points using Haversine formula
// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // Earth's radius in meters
//   const φ1 = (lat1 * Math.PI) / 180;
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // distance in meters
// }

// server.listen(5009, () =>
//   console.log("🚀 Location-Tracker running on port 5009")
// );
