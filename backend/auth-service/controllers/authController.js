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
