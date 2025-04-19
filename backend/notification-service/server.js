import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/notificationservice")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// WebSocket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  // Join a room based on userId
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  
  // Listen for order updates
  socket.on("orderUpdate", (data) => {
    // Broadcast to specific user
    io.to(data.userId).emit("orderStatusUpdate", data);
    console.log(`Order update sent to user ${data.userId}`);
  });
  
  // Listen for delivery location updates
  socket.on("locationUpdate", (data) => {
    // Broadcast to specific user
    io.to(data.userId).emit("deliveryLocationUpdate", data);
    console.log(`Location update sent to user ${data.userId}`);
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/notifications", notificationRoutes);

// Export socket.io instance for use in other files
export { io };

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));