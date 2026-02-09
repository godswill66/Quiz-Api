const Result = require("../models/Result");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");

/**
 * @desc    Submit a completed quiz and calculate the score
 * @route   POST /api/results/:quizId/submit
 * @access  Private
 */
exports.submitQuiz = async (req, res) => {
  try {
    // We get quizId from params (URL) and answers from the body
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quizId format" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Fetch questions to verify answers
    const questionIds = answers.map((a) => a.questionId);
    const allQuestions = await Question.find({ _id: { $in: questionIds } });

    let totalQuestions = allQuestions.length;
    let totalCorrect = 0;
    let totalAnswered = 0;

    // --- Core Scoring Logic ---
    for (const answer of answers) {
      const question = allQuestions.find(
        (q) => q._id.toString() === answer.questionId,
      );
      if (!question) continue;

      if (answer.selectedAnswers?.length > 0) totalAnswered++;

      const correct = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.text)
        .sort();

      const selected = (answer.selectedAnswers || []).sort();

      if (JSON.stringify(correct) === JSON.stringify(selected)) {
        totalCorrect++;
      }
    }

    const scorePercentage = (totalCorrect / totalQuestions) * 100 || 0;

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

    // SAVE TO DATABASE
    // We use "savedResult" as the variable name to avoid overwriting the "Result" Model
    const savedResult = await Result.create({
      quiz: quizId,
      user: req.user._id,
      answers,
      score: scorePercentage,
      grade,
    });

    res.status(201).json({
      message: "Quiz submitted successfully",
      result: savedResult,
      total_questions: totalQuestions,
      answered: totalAnswered,
      correct: totalCorrect,
      score_percentage: scorePercentage.toFixed(2),
      grade,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Get all quiz results for the logged-in user
 */
exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id }).populate(
      "quiz",
      "title description",
    );
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Get results for a specific quiz
 */
exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quizId format" });
    }
    const results = await Result.find({
      quiz: quizId,
      user: req.user._id,
    });
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
