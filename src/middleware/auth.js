// Import the jsonwebtoken library for verifying the token signature
const jwt = require("jsonwebtoken");
// Import the User model to fetch user details from the database
const User = require("../models/User");

/**
 * @desc    Middleware to protect routes, ensuring the user is authenticated via JWT
 * @param   {object} req - Express request object
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware function
 */
module.exports = async (req, res, next) => {
  // Extract the authorization header
  const header = req.headers.authorization;

  // Check if the header exists and is in the correct "Bearer TOKEN" format
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided, authorization denied" });

  // Extract the actual token string from the header
  const token = header.split(" ")[1];

  try {
    // Verify the token using the secret key from environment variables
    // This decodes the payload (which contains the user ID) if successful
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user associated with the token's ID, excluding the password field
    const user = await User.findById(decoded.id).select("-password");

    // If the user associated with the token no longer exists in the DB
    if (!user) return res.status(401).json({ message: "User associated with token not found" });

    // Attach the user object to the request object so downstream controllers can access user info
    req.user = user;
    
    // Pass control to the next handler in the route stack
    next();

  } catch (err) {
    // If jwt.verify fails (e.g., wrong signature, expired token), return an unauthorized error
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
