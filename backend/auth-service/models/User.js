import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Embedded address schema
const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
  homeTown: { type: String, required: true },
  postalCode: { type: Number, required: true },
});

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: [addressSchema],
  role: {
    type: String,
    enum: ['customer', 'restaurant_admin', 'delivery_person', 'admin'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  favoriteRestaurants: [  
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
