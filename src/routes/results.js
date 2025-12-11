// Import the Router module from Express
const router = require("express").Router();
// Import the authentication middleware
const auth = require("../middleware/auth");
// Import the controller functions for handling result logic
const resultCtrl = require("../controllers/resultController");
// Note: Consider importing the validateObjectId middleware here for :quizId params

/**
 * @route   POST /api/results/:quizId/submit
 * @desc    Submit a user's answers for grading a specific quiz
 * @access  Private
 * Note: Consider adding validateObjectId middleware before resultCtrl.submitQuiz
 */
router.post("/:quizId/submit", auth, resultCtrl.submitQuiz);

/**
 * @route   GET /api/results/
 * @desc    Fetch all results for the authenticated user across all quizzes
 * @access  Private
 */
router.get("/", auth, resultCtrl.getUserResults);

/**
 * @route   GET /api/results/:quizId
 * @desc    Fetch specific results for a single quiz taken by the user
 * @access  Private
 * Note: Consider adding validateObjectId middleware before resultCtrl.getQuizResults
 */
router.get("/:quizId", auth, resultCtrl.getQuizResults);

// Export the configured router to be used by the main application (server.js)
module.exports = router;
