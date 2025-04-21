import express from "express";
import Order from "../models/Order.js";
import { io } from "../server.js";
import axios from "axios";

const router = express.Router();

// Function to send notifications
async function sendNotification(userId, type, content) {
  try {
    await axios.post("http://notification-service:5003/api/notifications", {
      userId,
      type,
      content
    });
  } catch (error) {
    console.error("Failed to send notification:", error.message);
  }
}

// Function to notify microservices about order updates
async function notifyServices(order, status) {
  try {
    // Emit socket event for real-time updates
    io.to(`order_${order._id}`).emit("orderStatusUpdate", {
      orderId: order._id,
      status: status,
      updatedAt: new Date()
    });
    
    // If status is "Confirmed", notify delivery service to assign a driver
    if (status === "Confirmed") {
      await axios.post("http://delivery-service:5010/api/delivery/assign", {
        orderId: order._id,
        userId: order.customerId,
        // You would need to pass more data in a real implementation
        deliveryAddress: "Customer Address", // Should be fetched from user profile
        deliveryFee: 2.50 // Example value
      });
    }
    
    // Notify customer about order status change
    await sendNotification(
      order.customerId,
      "email",
      `Your order #${order._id} status is now: ${status}`
    );
    
    await sendNotification(
      order.customerId,
      "sms",
      `Order #${order._id.toString().substring(0, 8)} update: ${status}`
    );    
    
  } catch (error) {
    console.error("Notification error:", error.message);
  }
}

// ✅ Place an order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    
    // Send notifications about the new order
    await notifyServices(newOrder, "Pending");
    
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get a single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update order status
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (req.body.status) {
      // Notify about status change
      await notifyServices(updatedOrder, req.body.status);
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Delete an order
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get orders by customer ID
router.get("/customer/:customerId", async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;