import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, image, phone, address, role } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Please Enter Strong Password With 8 Digit",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      image,
      phone,
      address,
      role,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

// Get user's favorite restaurants
export const getFavoriteRestaurants = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only return the list of restaurant IDs
    res.status(200).json({ favoriteRestaurants: user.favoriteRestaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add restaurant to favorites
export const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { restaurantId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteRestaurants: restaurantId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Restaurant added to favorites", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove restaurant from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { restaurantId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteRestaurants: restaurantId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Restaurant removed from favorites", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, image, address } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (image) user.image = image;
    if (address) {
      // Either replace entire address array or add a new address
      if (Array.isArray(address)) {
        user.address = address;
      } else {
        user.address.push(address);
      }
    }

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User management for admin
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block/unblock user (admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: isActive
        ? "User activated successfully"
        : "User blocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
