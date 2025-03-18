const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    try {
        // Get token from request headers
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify JWT token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token." });
            }

            req.user = decoded; // Attach user info (userId, role) to `req`
            next();
        });

    } catch (error) {
        res.status(500).json({ error: "Authentication error: " + error.message });
    }
};
