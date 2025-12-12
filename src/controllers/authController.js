// Import the User model to interact with the users collection in MongoDB
const User = require("../models/User");
// Import the jsonwebtoken library for creating and verifying JWTs
const jwt = require("jsonwebtoken");
// Note: bcryptjs is often used for password hashing/comparison
const bcrypt = require("bcryptjs");

// REMOVE THE LINE: const auth = require("../routes/auth"); 

/**
 * @desc    Generates a JSON Web Token (JWT) for a given user ID.
 * ... (rest of createToken function) ...
 */
function createToken(user) {
  // Signs the token using the user's ID, a secret key, and an expiration time
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

/**
 * @desc    Register a new user account
 * ... (rest of register function) ...
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // ... (rest of the register logic) ...
    res.send("User registered successfully");
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Authenticate a user and issue a token (Login)
 * ... (rest of login function) ...
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // ... (rest of the login logic) ...
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
