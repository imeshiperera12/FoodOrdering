import express from "express";
import { login, register } from "../controllers/authController.js";
import User from "../models/User.js"; 

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// ✅ Get user by ID (for notification-service)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

export default router;
