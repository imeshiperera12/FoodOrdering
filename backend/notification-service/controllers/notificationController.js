import Notification from "../models/Notification.js";
import { sendEmail } from "../config/emailService.js";
import { sendSMS } from "../config/smsService.js";
import axios from "axios";

export const createNotification = async (req, res) => {
  try {
    const { userId, type, content } = req.body;

    // Get user info from auth-service
    const userResponse = await axios.get(`http://auth-service:5007/api/users/${userId}`);
    const user = userResponse.data;

    const notification = new Notification({
      userId,
      type,
      content
    });

    await notification.save();

    let result;

    if (type === 'email' && user.email) {
      result = await sendEmail(user.email, "Food Delivery Notification", content);
    } else if (type === 'sms' && user.phone) {
      result = await sendSMS(user.phone, content);
    }

    notification.status = result?.success ? 'sent' : 'failed';
    await notification.save();

    res.status(201).json({
      success: true,
      notification,
      deliveryStatus: result
    });

  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};