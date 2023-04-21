const User = require("../models/User");

// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");
// Define a secret key for signing JWTs
const JWT_SECRET = "idontknow";

// Define a middleware function for authenticating requests with JWTs
const authMiddleware = (req, res, next) => {
  // Extract the authorization header from the request
  const authHeader = req.headers.authorization;

  // If there is no authorization header, return a 401 response
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  // Extract the JWT token from the authorization header
  const token = authHeader.split(" ")[1];
  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // If the token is valid, add the decoded payload to the request object
    req.user = decoded;
    // console.log(decoded);

    // Call the next middleware function in the chain
    next();
  } catch (err) {
    // If the token is invalid or expired, return a 401 response
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const adminMiddleware = async (req, res, next) => {
  const userId = req.user._id;
  //console.log(userId);

  const user = await User.findById(userId);
  const role = user.role;
  
  // Check if the user has admin role
  if (role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

// Export the middleware function 
module.exports = { authMiddleware, adminMiddleware };
