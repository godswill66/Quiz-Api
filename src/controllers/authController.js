// Import the User model to interact with the users collection in MongoDB
const User = require("../models/User");
// Import the jsonwebtoken library for creating and verifying JWTs
const jwt = require("jsonwebtoken");
// Note: bcryptjs is often used for password hashing/comparison, 
// though the actual use might be encapsulated within the User model methods.
const bcrypt = require("bcryptjs");

/**
 * @desc    Generates a JSON Web Token (JWT) for a given user ID.
 * @param   {object} user - The user object containing the MongoDB _id.
 * @returns {string} The signed JWT token.
 */
function createToken(user) {
  // Signs the token using the user's ID, a secret key, and an expiration time
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if a user with the provided email already exists
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    // Create the new user. Hashing of the password should ideally happen in a Mongoose pre-save hook.
    const user = await User.create({ name, email, password });
    
    // Generate a secure JWT for the newly registered user
    const token = createToken(user);

    // Respond with success status, token, and safe user information (exclude the password)
    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    // Log server-side errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Authenticate a user and issue a token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email, explicitly selecting the password field (which is usually hidden by default)
    const user = await User.findOne({ email }).select("+password");
    
    // Check if the user exists
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare the submitted password with the hashed password stored in the database
    // Assumes `user.comparePassword` is a method on your User schema
    const valid = await user.comparePassword(password);
    
    // Check if the password is valid
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    // Generate a JWT for the authenticated user
    const token = createToken(user);

    // Respond with success status, token, and safe user information
    res.json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    // Log server-side errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
