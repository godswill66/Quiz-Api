// Import the Express library
const express = require("express");
// Create a new router instance
const router = express.Router();
// Import the controller functions for handling answer logic
const answerCtrl = require("../controllers/answerController");
// Import the authentication middleware to protect routes
const auth = require("../middleware/authMiddleware");
// Import the middleware to validate MongoDB Object IDs in parameters
const validateObjectId = require("../utils/validateObjectId");

/**
 * @route   POST /api/answer/:questionId
 * @desc    Add a new answer to a specific question
 * @access  Private
 */
router.post(
  "/:questionId",
  auth, // 1. Authenticate user
  validateObjectId, // 2. Validate the :questionId format
  answerCtrl.addAnswer // 3. Execute the controller logic
);

/**
 * @route   PUT /api/answer/:questionId/:answerId
 * @desc    Update a specific answer
 * @access  Private
 */
router.put(
  "/:questionId/:answerId",
  auth, // 1. Authenticate user
  validateObjectId, // 2. Validate both :questionId and :answerId formats
  answerCtrl.updateAnswer // 3. Execute the controller logic
);

/**
 * @route   DELETE /api/answer/:questionId/:answerId
 * @desc    Delete a specific answer
 * @access  Private
 */
router.delete(
  "/:questionId/:answerId",
  auth, // 1. Authenticate user
  validateObjectId, // 2. Validate both :questionId and :answerId formats
  answerCtrl.deleteAnswer // 3. Execute the controller logic
);

// Export the configured router to be used by the main application (server.js)
module.exports = router;