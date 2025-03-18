const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUpUser = async (req, res) => {
  try {
    body = req.body;
     userExists = await User.findOne({ email: body.email });
    if(userExists) return res.status(400).json({ error: "Email is already in use" });
    if (body.password) {
      salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
 
    user = new User(body);
    await user.save();
    
   return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.signInUser = async (req, res) => {
    try {
      const { email, password } = req.body;
     
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "Email or password is incorrect" });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Email or password is incorrect" });
      }
  
      // Generate a token
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1D",
      });
  
      // Set the authorization header
      res.set("Authorization", `Bearer ${token}`);
  
      // Send the user data without the password
      const userWithoutPassword = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        city: user.city,
          gender: user.gender,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
      return res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  