const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token not found" });
  }

  const authToken = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(authToken, process.env.SECRET_KEY);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If the token verification failed, return an unauthorized error
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware };
