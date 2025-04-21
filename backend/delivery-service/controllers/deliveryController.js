import Delivery from "../models/Delivery.js";
import { io } from "../app.js";
import axios from "axios";

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

// Assign a delivery to a delivery person
export const assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId, userId, deliveryAddress, deliveryFee } =
      req.body;

    const delivery = await Delivery.create({
      orderId,
      deliveryPersonId,
      userId,
      deliveryAddress,
      deliveryFee,
    });

    // Notify delivery person via notification service
    await sendNotification(
      deliveryPersonId,
      "push",
      `New delivery assigned: Order #${orderId.substring(0, 8)}`
    );

    await sendNotification(
      deliveryPersonId,
      "email",
      `New delivery assigned: Order #${orderId.substring(
        0,
        8
      )}. Please check your app.`
    );

    // Notify customer that delivery has been assigned
    await sendNotification(
      userId,
      "push",
      `Your order has been assigned to a delivery person`
    );

    await sendNotification(
      userId,
      "email",
      `Your order #${orderId.substring(0, 8)} has been assigned to a delivery person.`
    );    

    // Emit socket event for real-time updates
    io.emit("delivery_assigned", {
      deliveryId: delivery._id,
      status: delivery.status,
      orderId: delivery.orderId,
    });

    res.status(201).json({ message: "Delivery assigned", delivery });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error assigning delivery", error: err.message });
  }
};

// Get deliveries for a delivery person
export const getDeliveriesByPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;
    const deliveries = await Delivery.find({ deliveryPersonId });
    res.status(200).json(deliveries);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching deliveries", error: err.message });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const updated = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status, "locationUpdate.updatedAt": Date.now() },
      { new: true }
    );

    // Notify customer about status update
    await sendNotification(
      delivery.userId,
      "email",
      `Your delivery status is now: ${status}`
    );
    
    await sendNotification(
      delivery.userId,
      "sms",
      `Delivery update: ${status}`
    );
    
    await sendNotification(
      delivery.userId,
      "push",
      `Your delivery status is now: ${status}`
    );    

    // Emit socket event for real-time updates
    io.to(`delivery_${deliveryId}`).emit("delivery_status_update", {
      deliveryId: updated._id,
      status: updated.status,
      updatedAt: updated.locationUpdate.updatedAt,
    });

    // If status is "delivered", notify order service
    if (status === "delivered") {
      try {
        await axios.put(
          `http://order-service:5001/api/orders/${delivery.orderId}`,
          {
            status: "Delivered",
          }
        );
      } catch (error) {
        console.error("Failed to update order status:", error.message);
      }
    }

    res
      .status(200)
      .json({ message: "Delivery status updated", delivery: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
};

// Update GPS location of delivery person
export const updateDeliveryLocation = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { lat, lng } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const updated = await Delivery.findByIdAndUpdate(
      deliveryId,
      {
        locationUpdate: { lat, lng, updatedAt: Date.now() },
      },
      { new: true }
    );

    // Calculate and update estimated time if needed
    // This is just a placeholder - in a real app, you would use maps API
    const estimatedTime = calculateEstimatedTime(
      lat,
      lng,
      delivery.deliveryAddress
    );
    if (estimatedTime !== delivery.estimatedTime) {
      updated.estimatedTime = estimatedTime;
      await updated.save();
    }

    // Emit socket event for real-time location updates
    io.to(`delivery_${deliveryId}`).emit("delivery_location_update", {
      deliveryId: updated._id,
      location: updated.locationUpdate,
      estimatedTime: updated.estimatedTime,
    });

    // Also emit to notification service socket
    io.emit("locationUpdate", {
      userId: delivery.userId,
      deliveryId: updated._id,
      location: updated.locationUpdate,
      estimatedTime: updated.estimatedTime,
    });

    // Send email + SMS to customer
    await sendNotification(
      delivery.userId,
      "email",
      `🚚 Your delivery is on the way! Current location: (${lat}, ${lng})\nEstimated time of arrival: ${estimatedTime}.`
    );

    await sendNotification(
      delivery.userId,
      "sms",
      `🚚 Delivery update: ETA ${estimatedTime}`
    );

    res.status(200).json({ message: "Location updated", delivery: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating location", error: err.message });
  }
};

// Helper function to calculate estimated delivery time
function calculateEstimatedTime(lat, lng, deliveryAddress) {
  // This would normally use a maps API to calculate real ETA
  // For now, just return a placeholder value
  return "15-20 min";
}

// Get delivery details by ID
export const getDeliveryById = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json(delivery);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching delivery", error: err.message });
  }
};

// Track delivery by order ID (for customers)
export const trackDeliveryByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const delivery = await Delivery.findOne({ orderId });

    if (!delivery) {
      return res
        .status(404)
        .json({ message: "No delivery found for this order" });
    }

    res.status(200).json(delivery);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error tracking delivery", error: err.message });
  }
};
