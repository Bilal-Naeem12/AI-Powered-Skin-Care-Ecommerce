exports.roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
      try {
          if (!req.user) {
              return res.status(401).json({ message: "Unauthorized request." });
          }
    
          if (req.user.role !== requiredRole) {
              return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
          }

          next(); // User has the required role, continue
      } catch (error) {
          res.status(500).json({ error: "Role verification error: " + error.message });
      }
  };
};
