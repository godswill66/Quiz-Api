const questionCtrl = require("../controllers/questionController"); // Adjust path if needed// Import the Express library
const express = require("express");
// Create a new router instance
const router = express.Router();
// Import the controller functions for handling quiz logic
const quizCtrl = require("../controllers/quizController");
// Import the authentication middleware to protect all routes within this router
const auth = require("../middleware/authMiddleware");
// Note: You may want to import the validateObjectId middleware here for :id params

/*
 * Apply the 'auth' middleware to all subsequent routes defined in this file.
 * Alternatively, you can apply it per route as done below.
 */

/**
 * @route   POST /api/quizzes/
 * @desc    Create a new quiz
 * @access  Private
 */
router.post("/:id/questions", auth, questionCtrl.createQuestion);
/**
 * @route   GET /api/quizzes/
 * @desc    Fetch all quizzes belonging to the authenticated user
 * @access  Private
 */
router.get("/", auth, quizCtrl.getUserQuizzes);

/**
 * @route   GET /api/quizzes/:id
 * @desc    Fetch a single quiz by ID (with questions populated)
 * @access  Private
 * Note: Consider adding the validateObjectId middleware before quizCtrl.getQuiz
 */
router.get("/:id", auth, quizCtrl.getQuiz);

/**
 * @route   PUT /api/quizzes/:id
 * @desc    Update quiz details
 * @access  Private
 * Note: Consider adding the validateObjectId middleware before quizCtrl.updateQuiz
 */
router.put("/:id", auth, quizCtrl.updateQuiz);

/**
 * @route   DELETE /api/quizzes/:id
 * @desc    Delete a quiz
 * @access  Private
 * Note: Consider adding the validateObjectId middleware before quizCtrl.deleteQuiz
 */
router.delete("/:id", auth, quizCtrl.deleteQuiz);


router.use('/:id/questions', require('./questions.js'));
/**
 * @route   PATCH /api/quizzes/:id/archive
 * @desc    Update the status of a quiz to active or archived
 * @access  Private
 * Note: Consider adding the validateObjectId middleware before quizCtrl.archiveQuiz
 */
router.patch("/:id/archive", auth, quizCtrl.archiveQuiz);

// Export the configured router to be used by the main application (server.js)
module.exports = router;
