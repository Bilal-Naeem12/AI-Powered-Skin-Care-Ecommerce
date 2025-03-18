const User = require("../models/User");

const roleMiddleware = (givenrole) => {
    return async (req, res, next) => {
          const  {role} = await User.findById(req.user.id ) 
      if (req.user && role === givenrole) {
        next();
      } else {
        return res.status(403).json({ message: `Access denied: ${givenrole} only` });
      }
    };
  };
  
  module.exports = {roleMiddleware};
  