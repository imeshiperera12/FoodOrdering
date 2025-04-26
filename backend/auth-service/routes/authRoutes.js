import express from "express";
import { login, register, getFavoriteRestaurants, addToFavorites, removeFromFavorites, updateProfile, getAllUsers, toggleUserStatus } from "../controllers/authController.js";
import User from "../models/User.js"; 
import authorizeRoles from "../middleware/authorizeRoles.js";
import authMiddleware from "../middleware/authMiddleware.js";

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

router.get('/favorites', authMiddleware, getFavoriteRestaurants);
router.post('/favorites', authMiddleware, addToFavorites);
router.delete('/favorites/:restaurantId', authMiddleware, removeFromFavorites);
router.put('/profile', authMiddleware, updateProfile);

// Admin routes
router.get('/users', authMiddleware, authorizeRoles('admin'), getAllUsers);
router.patch('/users/:userId/status', authMiddleware, authorizeRoles('admin'), toggleUserStatus);

export default router;
