const User = require('./userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../../services/emailService');
const isProd = process.env.NODE_ENV === "production";
const { registerUser } = require("./userService");
const { notify } = require("../notification/notificationService");

const commonOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };
// controllers/userController.js  (inside exports.getAllUsers)
const buildUserQuery = ({ name, deleted }) => {
  const q = { isDeleted: deleted === "true" };     // ⭐ NEW
  if (name) {
    const regex = new RegExp(name.trim(), "i");
    q.$or = [{ first_name: regex }, { last_name: regex }, { email: regex }];
  }
  return q;
};

// **🔹 User Registration**

exports.registerUser = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });

 await notify({
  kind: "NEW_USER",
  title: `New user registered: ${newUser.email}`,
  body: "A new user has signed up. Review their details in the admin panel.",
  role: "admin"
});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// **🔹 Verify Email**
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Invalid or expired token");
if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
    return res.status(400).json({ message: "Verification link has expired." });
  }
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Render view with user's name and login URL
    return res.status(200).render("emailVerified", {
      name: user.first_name,
      loginUrl: `${process.env.FRONTEND_URL}/login`,
    });

  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};


// **🔹 User Login**
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
       
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const accessToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();
  let isFirstLogin = false;

    if (!user.firstLoginAt) {
      user.firstLoginAt = new Date();
      isFirstLogin = true;
    }

        user.refreshToken = refreshToken;
        await user.save();

        // Set access token cookie with a short expiration time (e.g., 15 mins)
  res.cookie('accessToken', accessToken, {
    ...commonOptions,
    maxAge: 100*60*1000, // 15 minutes
  });

  // Set refresh token cookie with a longer expiration time (e.g., 7 days)
  res.cookie('refreshToken', refreshToken, {
 ...commonOptions,
   maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Convert to object and exclude password and refreshToken
  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;
 res.status(200).json({
      user: safeUser,
      isFirstLogin, // ✅ NEW FIELD
      message: `Login successful! Welcome ${safeUser.first_name}`,
      accessToken,
    });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.checkRefreshTokenStatus = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(200).json({ valid: false, reason: "No token" });
    }

    // Decode token without throwing
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(200).json({ valid: false, reason: "Expired or Invalid" });
      }

      const user = await User.findOne({ _id: decoded.userId, refreshToken: token });
      if (!user) {
        return res.status(200).json({ valid: false, reason: "Token doesn't match user" });
      }

      return res.status(200).json({ valid: true });
    });

  } catch (err) {
    return res.status(500).json({ valid: false, reason: "Server error", error: err.message });
  }
};

// **🔹 Refresh Token**
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
      if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
       
        // Find user with the matching refresh token
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new access token
        const newAccessToken = user.generateAuthToken();

        // Set access token cookie (short expiry)
        res.cookie('accessToken', newAccessToken, {
           ...commonOptions,
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
      const { user } = req;
      if (!user?._id) {
        return res.status(401).json({ message: "Unauthorised – no user in request" });
      }
  
      const updates = req.body;
      if (updates.email) {
        const email = updates.email.toLowerCase().trim();
  
        // is there another user with this e-mail?
        const emailTaken = await User.findOne({
          _id: { $ne: user._id },      // not this user
          email,
        });
  
        if (emailTaken) {
          return res
            .status(400)
            .json({ message: "That e-mail address is already registered." });
        }
  
        updates.email = email;         // normalise before save
      }
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        updates,
        { new: true, runValidators: true }
      ).select("-password -refreshToken");
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        user: updatedUser,
        message: `${updatedUser.first_name} profile successfully updated`,
      });
    } catch (error) {
      console.error("updateUserProfile:", error);
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
    const { page = 1, limit = 15, name,deleted } = req.query;

    const query = buildUserQuery({ name,deleted });

    const totalCount = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-password -refreshToken");

    res.json({ users, page: Number(page), limit: Number(limit), totalCount });
  } catch (err) {
    console.error("getAllUsers:", err);
    res.status(500).json({ error: err.message });
  }
};

// **🔹 Change User Role (Admin)**
exports.changeUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    if (!["user", "admin"].includes(newRole))
      return res.status(400).json({ message: "Invalid role." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = newRole;
    await user.save();
await notify({
  kind: "ROLE_CHANGED",
  title: "Your account role was updated",
  body: `You have been assigned the role: ${user.role}.`,
  userId: user._id,
  data: { newRole: user.role }
});
    res.json({ message: "User role updated." });
  } catch (err) {
    console.error("changeUserRole:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.adminSoftDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.isDeleted)
      return res.status(404).json({ message: "User not found." });

    user.isDeleted = true;
    await user.save();
await notify({
  kind: "ACCOUNT_SUSPENDED",
  title: "Your account has been suspended by an admin",
  body: "You cannot access the platform until further notice.",
  userId: user._id
});
    res.json({ message: "User deleted." });
  } catch (err) {
    console.error("adminSoftDeleteUser:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.logoutUser = (req, res) => {
    res.clearCookie("accessToken", {
      
      
 
    });
    res.clearCookie("refreshToken", {
    
    });
  
    return res.status(200).json({ message: "Logout successful." });
  };


  exports.restoreSoftDeletedUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || !user.isDeleted) {
      return res.status(404).json({ message: "User not found or not deleted." });
    }
    user.isDeleted = false;

    await user.save();
   await notify({
  kind: "ACCOUNT_RESTORED",
  title: "Your account has been restored",
  body: "You now have full access to the platform again.",
  userId: user._id
});
    res.json({ message: "User restored." });
  };




  exports.updateUserConsent = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "consent.faceScanConsent": true,
          "consent.termsAccepted": true, // optional if you're collecting this now
          "consent.agreedAt": new Date(),
        },
      },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Consent update error:", err);
    res.status(500).json({ error: "Could not update consent" });
  }
};


exports.completeWalkthrough = async (req, res) => {
  try {
    const userId = req.params.id; // ✅ use `id` not `_id` in the route param

    const { walkThroughCompleted, profileImage, allergenPreferences } = req.body;

    // ✅ Validate walkThroughCompleted
    if (typeof walkThroughCompleted !== "boolean") {
      return res
        .status(400)
        .json({ message: "walkThroughCompleted must be boolean." });
    }

    // ✅ Build the update fields dynamically
    const updateFields = {
      walkThroughCompleted,
    };

    if (profileImage && typeof profileImage === "string") {
      updateFields.profileImage = profileImage;
    }

    if (Array.isArray(allergenPreferences)) {
      updateFields.allergenPreferences = allergenPreferences;
    }

    // ✅ Do the update and return the new user without sensitive fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Walkthrough status updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Walkthrough update error:", err);
    res.status(500).json({ message: "Server error." });
  }
};