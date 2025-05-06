import User from "../models/user.js";
import dotenv from "dotenv";
import { hashPassword,comparePassword } from "../helpers/auth.js";
import { generateRandomToken } from "../helpers/generateToken.js";
import { generateTokenAndSetCookie, generateResetToken } from "../helpers/generateTokenandSetCookie.js";

dotenv.config();

export const register = async (req, res) => {
    const { fullName, phoneNumber, email, password, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
         // Hash the user's password for secure storage
        const hashed = await hashPassword(password);

         // Generate a random verification token
        const tokens = generateRandomToken();

        // Create new user
        const user = new User({
            fullName,
            phoneNumber,
            email,
            password: hashed,
            role : role || "tenant", // Default to "tenant" if not provided
            verificationToken: tokens,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // Token valid for 24 hours
        });

        // Save user to database
        await user.save();
        // Generate a JWT token, set it in a cookie, and send the verification email
        const token = generateTokenAndSetCookie(res, user._id, user.role);
        return res.status(201).json({ success: true, user, token, message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Server error" });
    }
}
export const verifyEmail = async (req, res) => {
    const { token } = req.body; // Token sent in the request body

    try {
        // Find the user with the matching verification token
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }, // Ensure the token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Mark the user as verified
        user.verificationToken = undefined; // Clear the token
        user.verificationTokenExpires = undefined; // Clear the expiration
        user.isVerified = true; // Mark as verified
        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email is incorrect" });
        }
        // Check if password is correct
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
         // Generate a JWT token, set it in a cookie, and update the user's last login time
        const token = generateTokenAndSetCookie(res, user._id, user.role);
        user.lastLogin = new Date();
        await user.save();
        return res.status(200).json({ success: true,message: "Login successful", user, token });
        
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Server error" });

    }

}

export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validate email
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email is required" });
      }
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Invalid email" });
      }
  
      // Generate reset token
      const resetToken = generateResetToken(user._id);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      console.log("Reset token: ", resetToken);
      await user.save();
  
      // Create password reset link
    //   const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
      // Send password reset email
    //   await sendResetEmail(email, user.firstName, resetLink);
  
      return res.json({
        success: true,
        message: "Reset password instructions sent successfully",
      });
    } catch (err) {
      console.error("Forgot password error: ", err);
      return res
        .status(500)
        .json({
          success: false,
          message: err.message,
        });
    }
  };

  export const resetPassword = async (req, res) => {
    try {
      const { newPassword } = req.body;
      const { resetToken } = req.params;
      console.log(req.params);
  
      // Validate new password and token
      if (!newPassword) {
        return res
          .status(400)
          .json({ success: false, message: "New password is required" });
      }
  
      if (!resetToken) {
        return res
          .status(400)
          .json({ success: false, message: "Reset token is required" });
      }
  
      // Find user by resetToken and ensure the token has not expired
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }, // Token should still be valid
      });
  
      if (!user) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid or expired reset token" });
      }
  
      // Hash the new password and update the user's password
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
  
      // Clear the reset token and expiration
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
  
      await user.save();
  
      return res.json({ success: true, message: "Password reset successfully" });
    } catch (err) {
      console.error("Reset password error: ", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Password reset failed",
          error: err.message,
        });
    }
  };
  
