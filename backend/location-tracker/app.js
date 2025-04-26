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

server.listen(5009, () =>
  console.log("🚀 Location-Tracker running on port 5009")
);
