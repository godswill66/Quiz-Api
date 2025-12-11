// Import the Express library
const express = require("express");
// Create a new router instance
const router = express.Router();
// Import the controller functions for handling authentication logic (register/login)
const authController = require("../controllers/authController");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post("/register", authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and issue a JWT token
 * @access  Public
 */
router.post("/login", authController.login);

// Export the configured router to be used by the main application (server.js)
module.exports = router;
