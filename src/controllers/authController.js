const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * Helper to generate JWT
 */
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * @route   POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists (to avoid the E11000 error)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 2. Create user (Mongoose pre-save hook handles hashing)
    const newUser = await User.create({ name, email, password });

    // 3. Generate Token
    const token = createToken(newUser);

    res.status(201).json({
      status: "success",
      token,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and explicitly include the hidden password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // 2. Compare passwords using the method in your User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate Token
    const token = createToken(user);

    res.status(200).json({
      status: "success",
      token,
      userId: user._id,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};