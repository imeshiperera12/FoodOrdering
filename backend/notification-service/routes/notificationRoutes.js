import express from "express";
import { createNotification, getNotificationsByUser } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/user/:userId", getNotificationsByUser);

export default router;