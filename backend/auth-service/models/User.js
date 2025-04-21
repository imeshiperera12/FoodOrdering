import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
  homeTown: { type: String, required: true },
  postalCode: { type: Number, required: true }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique : true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    // unique: true
  },
  address: [
    addressSchema
  ],
  role: {
    type: String,
    enum: ['customer', 'restaurant_admin', 'delivery_person', 'admin'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;