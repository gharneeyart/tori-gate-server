import mongoose from 'mongoose';

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      match: /^[a-zA-Z\s'-]+$/
    },
    phoneNumber: {
      type: String,
      match: /^(\+234\d{10}|234\d{10}|0[789][01]\d{8})$/,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 64,
      required: true,
    },
    image: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["tenant", "landlord"],
      default: "tenant"
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verificationToken: String,
    verificationTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
