const scoringService = require("../services/scoringService");
const Result = require("../models/Result");

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const submittedAnswers = req.body.answers;

    const scoreData = await scoringService.calculateScore(
      quizId,
      submittedAnswers
    );

    const savedResult = await Result.create({
      quiz: quizId,
      user: req.user._id,
      ...scoreData,
    });

    res.status(201).json({
      message: "Quiz submitted successfully",
      result: savedResult,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
