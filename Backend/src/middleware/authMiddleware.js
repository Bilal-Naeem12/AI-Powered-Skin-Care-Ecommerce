const jwt = require("jsonwebtoken");
const User = require('../modules/users/userModel'); // Assuming you have the User model imported

exports.authMiddleware = (req, res, next) => {
    try {
        // Get token from request headers
        const token = req.cookies.accessToken;
     console.log(token)
        // if (!token) {
        //     return res.status(401).json({ message: "Access denied. No token provided." });
        // }
       
        // Verify JWT token
        jwt.verify(token, process.env.JWT_SECRET,async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token." });
            }

            try {
             
                // Fetch the user from the database using the decoded userId
                const user = await User.findById(decoded.userId).select("-password -refreshToken"); // Excluding password and refresh token for security
               
                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }
        
                // Attach complete user information to `req.user`
                req.user = user;
                next();
            } catch (error) {
                return res.status(500).json({ message: "Server error while fetching user data." });
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Authentication error: " + error.message });
    }
};
