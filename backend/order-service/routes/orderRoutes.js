import express from "express";
import Order from "../models/Order.js";
import { io } from "../server.js";
import axios from "axios";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

async function getUserDetails(userId) {
  try {
    const response = await axios.get(`http://auth-service:5007/api/auth/${userId}`);
    const user = response.data;

    return {
      name: user.name,
      phone: user.phone,
      address: user.address?.[0] || null
    };
  } catch (error) {
    console.error("Failed to fetch user details:", error.message);
    return null;
  }
}


// Function to send notifications
async function sendNotification(userId, type, content) {
  try {
    await axios.post("http://notification-service:5003/api/notifications", {
      userId,
      type,
      content,
    });
  } catch (error) {
    console.error("Failed to send notification:", error.message);
  }
}

// Function to notify microservices about order updates
async function notifyServices(order, status) {
  try {
    io.to(`order_${order._id}`).emit("orderStatusUpdate", {
      orderId: order._id,
      status: status,
      updatedAt: new Date(),
    });

    if (status === "Confirmed") {
      const userDetails = await getUserDetails(order.customerId);

      const deliveryAddress = userDetails?.address
        ? `${userDetails.address.addressLine1}, ${userDetails.address.addressLine2}, ${userDetails.address.homeTown}, ${userDetails.address.postalCode}`
        : "Address not available";

      await axios.post("http://delivery-service:5010/api/delivery/assign", {
        orderId: order._id,
        userId: order.customerId,
        deliveryAddress,
        deliveryFee: 2.5, 
      });
    }

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

// Place an order
router.post(
  "/",
  authMiddleware,
  authorizeRoles("customer", "admin"),
  async (req, res) => {
    try {
      const newOrder = new Order(req.body);
      await newOrder.save();

      await notifyServices(newOrder, "Pending");

      res
        .status(201)
        .json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error });
    }
  }
);

// Get all orders (admin only)
router.get("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get order by ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update order status
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("restaurant_admin", "admin"),
  async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (req.body.status) {
        await notifyServices(updatedOrder, req.body.status);
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete an order
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("restaurant_admin", "admin"),
  async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get orders by customer ID
router.get(
  "/customer/:customerId",
  authMiddleware,
  authorizeRoles("customer", "admin"),
  async (req, res) => {
    try {
      const orders = await Order.find({ customerId: req.params.customerId });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get orders by status
router.get(
  "/status/:status",
  authMiddleware,
  authorizeRoles("admin", "restaurant_admin"),
  async (req, res) => {
    try {
      const orders = await Order.find({ status: req.params.status });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get orders by restaurant ID
router.get(
  "/restaurant/:restaurantId",
  authMiddleware,
  authorizeRoles("restaurant_admin", "admin"),
  async (req, res) => {
    try {
      const orders = await Order.find({
        restaurantId: req.params.restaurantId,
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get restaurant order stats
router.get(
  "/stats/:restaurantId",
  authMiddleware,
  authorizeRoles("restaurant_admin", "admin"),
  async (req, res) => {
    try {
      const { restaurantId } = req.params;

      const totalOrders = await Order.countDocuments({ restaurantId });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = await Order.countDocuments({
        restaurantId,
        createdAt: { $gte: today },
      });

      const pendingOrders = await Order.countDocuments({
        restaurantId,
        status: "Pending",
      });
      const confirmedOrders = await Order.countDocuments({
        restaurantId,
        status: "Confirmed",
      });
      const deliveredOrders = await Order.countDocuments({
        restaurantId,
        status: "Delivered",
      });

      const revenueResult = await Order.aggregate([
        { $match: { restaurantId } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
      const totalRevenue =
        revenueResult.length > 0 ? revenueResult[0].total : 0;

      res.status(200).json({
        totalOrders,
        todayOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalRevenue,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }
);

// Rate an order
router.post(
  "/:orderId/rate",
  authMiddleware,
  authorizeRoles("customer"),
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { rating, review, restaurantId } = req.body;
      const customerId = req.user.id;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.customerId.toString() !== customerId) {
        return res
          .status(403)
          .json({ error: "Not authorized to rate this order" });
      }

      try {
        await axios.post("http://review-service:5005/api/reviews", {
          customerId,
          restaurantId: restaurantId || order.restaurantId,
          orderId,
          rating,
          review,
        });

        res.status(200).json({ message: "Review submitted successfully" });
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to submit review", details: error.message });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }
);

// Admin dashboard order statistics
router.get(
  "/admin/stats",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();

      const pendingOrders = await Order.countDocuments({ status: "Pending" });
      const confirmedOrders = await Order.countDocuments({
        status: "Confirmed",
      });
      const deliveredOrders = await Order.countDocuments({
        status: "Delivered",
      });

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const recentOrders = await Order.countDocuments({
        createdAt: { $gte: yesterday },
      });

      const revenueResult = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
      const totalRevenue =
        revenueResult.length > 0 ? revenueResult[0].total : 0;

      res.status(200).json({
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        recentOrders,
        totalRevenue,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }
);

export default router;
