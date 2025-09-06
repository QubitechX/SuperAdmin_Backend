const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, },
  userId: { type: String, required: true, unique: true },
  phone: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, },
  password: { type: String },
  anniversary: { type: Date, required: false },
  profileImage: { type: String, required: false },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  roles: {
    type: [
      {
        type: String,
        enum: ["user", "admin", "staff"],
      },
    ], default: ['user']
  },
  active: { type: Boolean, default: true },
  lastActiveAt: { type: Date },
  authToken: { type: String, trim: true },
  accountNumber: { type: String, default: null },
  bankName: { type: String, default: null },
  city: { type: String, default: null },
  branch: { type: String, default: null },
  ifscCode: { type: String, default: null },
  approvalBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null
  },
  // Status: 0 = Pending, 1 = Approved, 2 = Rejected
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  reason: {
    type: String
  },
  approvalAt: {
    type: Date,
    default: null
  },
  addedBy: { type: String, enum: ["admin", "user"] ,default: ['user']},
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
