const User = require('./userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../../services/emailService');

// **🔹 User Registration**
exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email is already in use" });

        // Create new user
        const newUser = new User({ first_name, last_name, email,password });

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        newUser.verificationToken = verificationToken;

        // Save user to DB
        await newUser.save();

        // Send verification email
        const verificationLink = `${process.env.FRONTEND_URL}/api/users/verify-email?token=${verificationToken}`;
        await sendEmail(email, "Verify Your Email", `Click here to verify: ${verificationLink}`);

        res.status(201).json({ message: "User registered successfully.\nPlease verify your email." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Verify Email**
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 User Login**
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(password)
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const accessToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        // Set access token cookie with a short expiration time (e.g., 15 mins)
  res.cookie('accessToken', accessToken, {
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 100*60*1000, // 15 minutes
  });

  // Set refresh token cookie with a longer expiration time (e.g., 7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 100*60*1000, // 7 days
  });

  // Convert to object and exclude password and refreshToken
  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;

  res.status(200).json({user:safeUser,message:`Login successful! Welcome ${safeUser.first_name}`});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Refresh Token**
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
      if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        console.log(token)
        // Find user with the matching refresh token
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new access token
        const newAccessToken = user.generateAuthToken();

        // Set access token cookie (short expiry)
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 100*60*1000, // 15 minutes
        });

        res.status(200).json({ message: "Access token refreshed successfully." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// **🔹 Password Reset (Request)**
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 20 * 60 * 1000; // 20 minutes from now

        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail(email, "Reset Your Password", `Click here to reset: ${resetLink} this link will be expired after 20 mins`);

        res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Password Reset (Set New Password)**
exports.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      // Find user by the reset token and ensure the token has not expired
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      // If no user found or token expired
      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired token. Please request a new password reset.",
        });
      }
      console.log(newPassword)
      // Hash and save the new password
      user.password = newPassword;
      user.resetPasswordToken = null; // Clear the reset token
      user.resetPasswordExpires = null; // Clear expiration time
  
      await user.save();
  
      res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while resetting the password. Please try again." });
    }
  };
  
// **🔹 Get User Profile**
exports.getUserProfile = async (req, res) => {
    try {
      
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Update User Profile**
exports.updateUserProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Soft Delete Account**
exports.softDeleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.softDelete();
        res.status(200).json({ message: "Account deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Get All Users (Admin)**
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// **🔹 Change User Role (Admin)**
exports.changeUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = newRole;
        await user.save();

        res.status(200).json({ message: "User role updated." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.logoutUser = (req, res) => {
    res.clearCookie("accessToken", {
      
      
 
    });
    res.clearCookie("refreshToken", {
    
    });
  
    return res.status(200).json({ message: "Logout successful." });
  };
