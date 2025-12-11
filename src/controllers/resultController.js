const Result = require("../models/Result");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");

// Submit quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quizId" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Fetch all questions
    const questionIds = answers.map((a) => a.questionId);
    const allQuestions = await Question.find({ _id: { $in: questionIds } });

    let totalQuestions = allQuestions.length;
    let totalCorrect = 0;
    let totalAnswered = 0;

    for (const answer of answers) {
      const question = allQuestions.find(
        (q) => q._id.toString() === answer.questionId
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

    const scorePercentage = (totalCorrect / totalQuestions) * 100;

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

    const result = await Result.create({
      quiz: quizId,
      user: req.user._id,
      answers,
      score: scorePercentage,
      grade,
    });

    res.json({
      message: "Quiz submitted",
      result,
      total_questions: totalQuestions,
      answered: totalAnswered,
      correct: totalCorrect,
      score_percentage: scorePercentage,
      grade,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------------------
// Get all results for logged-in user
// ------------------------------
exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id }).populate(
      "quiz",
      "title description"
    );

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------------------
// Get results for a single quiz
// ------------------------------
exports.getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ message: "Invalid quizId" });
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
