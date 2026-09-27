const jwt = require("jsonwebtoken");
const User = require("../modules/users/userModel");
exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) return res.status(401).json({ message: "Invalid token." });
    const user = await User.findById(decoded.userId).select("-password -refreshToken -verificationToken -resetPasswordToken");
    if (!user || user.isDeleted || !user.isVerified) return res.status(403).json({ message: "Account is unavailable or unverified." });
    req.user = user;
    next();
  } catch (error) { next(error); }
};
