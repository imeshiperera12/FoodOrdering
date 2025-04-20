import express from "express";
import {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/user/:userId", getNotificationsByUser);
router.put("/read/:notificationId", markAsRead);
router.delete("/:notificationId", deleteNotification);
router.get("/unread/:userId", getUnreadCount);

export default router;
