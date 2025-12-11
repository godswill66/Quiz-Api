// Import the dedicated service handling all scoring and validation logic
const scoringService = require("../services/scoringService");
// Import the Mongoose Result model to persist the final score
const Result = require("../models/Result");

/**
 * @desc    Submit a completed quiz, calculate the score via a service, and save the result
 * @route   POST /api/results/:quizId/submit (Assuming a route structure change for clarity)
 * @access  Private
 */
exports.submitQuiz = async (req, res) => {
  try {
    // Extract the quiz ID from parameters and the user's answers from the body
    const { quizId } = req.params;
    const submittedAnswers = req.body.answers;

    // Delegate core logic to the service layer: fetch correct answers, compare, and calculate score/grade
    const scoreData = await scoringService.calculateScore(
      quizId,
      submittedAnswers
    );
    
    // The service returns the score, grade, correct count, etc.
    // We now persist this data to the database
    const savedResult = await Result.create({
      quiz: quizId,
      user: req.user._id, // Assumes 'auth' middleware has populated req.user
      ...scoreData, // Spread operator to merge the calculated results into the new document
    });

    // Respond with created status and the saved result details
    res.status(201).json({
      message: "Quiz submitted successfully",
      result: savedResult,
    });
    
  } catch (err) {
    // Standard error handling (The scoringService should handle 404s/400s internally, 
    // but this catches unexpected 500 server errors)
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
