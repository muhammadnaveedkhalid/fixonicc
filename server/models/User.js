import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'client' }, // client, vendor, admin
  status: { type: String, default: 'active', enum: ['active', 'pending', 'rejected'] }, // active, pending, rejected
  rejectionReason: { type: String },
  // Profile fields
  bio: { type: String, default: '' },
  banner: { type: String, default: '' },
  specialties: [{ type: String }],
  profileImage: { type: String, default: '' },
  phoneNumber: { type: String },
  
  // Verification Fields
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  emailOtp: { type: String },
  phoneOtp: { type: String },
  otpExpires: { type: Date },
  emailVerifyToken: { type: String },
  emailVerifyExpires: { type: Date },

  // Location for vendors
  location: {
    address: { type: String },
    city: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  // Review Summary
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt (guard next so it works on Vercel/serverless)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (typeof next === 'function') next();
});

const User = mongoose.model('User', userSchema);

export default User;
