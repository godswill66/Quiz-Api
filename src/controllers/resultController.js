// Import the Mongoose Result model
const Result = require("../models/Result");
// Import the Mongoose Question model
const Question = require("../models/Question");
// Import the Mongoose Quiz model
const Quiz = require("../models/Quiz");
// Import Mongoose itself for utility functions (like isValidObjectId)
const mongoose = require("mongoose");

/**
 * @desc    Submit a completed quiz and calculate the score
 * @route   POST /api/results/submit
 * @access  Private
 */
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Manual validation for the quiz ID format
    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quizId format" });
    }

    // Verify that the quiz actually exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Fetch all relevant questions from the database in a single query
    const questionIds = answers.map((a) => a.questionId);
    const allQuestions = await Question.find({ _id: { $in: questionIds } });

    let totalQuestions = allQuestions.length;
    let totalCorrect = 0;
    let totalAnswered = 0;

    // --- Core Scoring Logic ---
    for (const answer of answers) {
      // Find the corresponding question object from the fetched list
      const question = allQuestions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (!question) continue; // Skip if question not found (e.g., deleted)

      // Count if an answer was provided at all
      if (answer.selectedAnswers?.length > 0) totalAnswered++;

      // Get the correct answers from the database data
      const correct = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.text)
        .sort(); // Sort for consistent comparison

      // Get the user's selected answers from the request body
      const selected = (answer.selectedAnswers || []).sort();

      // Compare the sorted correct answers array with the sorted selected answers array
      if (JSON.stringify(correct) === JSON.stringify(selected)) {
        totalCorrect++;
      }
    }

    // Calculate final metrics
    const scorePercentage = (totalCorrect / totalQuestions) * 100 || 0;

    // Assign a letter grade based on the percentage
    let grade =
      scorePercentage >= 90
        ? "A"
        : scorePercentage >= 75
        ? "B"
        : scorePercentage >= 60
        ? "C"
        : scorePercentage >= 50
        ? "D"
        : "F";

    // Save the result to the database
    const result = await Result.create({
      quiz: quizId,
      user: req.user._id, // Assumes 'auth' middleware provides req.user
      answers,
      score: scorePercentage,
      grade,
    });

    // Respond with the calculated results summary
    res.json({
      message: "Quiz submitted successfully",
      result,
      total_questions: totalQuestions,
      answered: totalAnswered,
      correct: totalCorrect,
      score_percentage: scorePercentage.toFixed(2), // Format for cleaner output
      grade,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Get all quiz results for the currently logged-in user
 * @route   GET /api/results/me
 * @access  Private
 */
exports.getUserResults = async (req, res) => {
  try {
    // Find results associated with the authenticated user and populate quiz details
    const results = await Result.find({ user: req.user._id }).populate(
      "quiz",
      "title description" // Select specific fields from the Quiz model
    );

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Get results for a specific quiz taken by the logged-in user
 * @route   GET /api/results/:quizId
 * @access  Private
 */
exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Manual validation for the quiz ID format (can be replaced by middleware)
    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quizId format" });
    }

    // Find all results for a specific quiz ID that belong to the current user
    const results = await Result.find({
      quiz: quizId,
      user: req.user._id,
    });

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
