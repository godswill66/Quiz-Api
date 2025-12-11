const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// Add answer to a question
exports.addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { text, isCorrect } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const question = await Question.findById(questionId)
      .populate("quiz");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Authorization: ensure the quiz belongs to the user
    if (question.quiz.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    question.answers.push({ text, isCorrect: !!isCorrect });
    await question.save();

    res.status(201).json({
      message: "Answer added",
      question
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update answer
exports.updateAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const { text, isCorrect } = req.body;

    const question = await Question.findById(questionId)
      .populate("quiz");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Auth check
    if (question.quiz.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (text) answer.text = text;
    if (isCorrect !== undefined) answer.isCorrect = isCorrect;

    await question.save();

    res.json({
      message: "Answer updated",
      question
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete answer
exports.deleteAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;

    const question = await Question.findById(questionId)
      .populate("quiz");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Auth check
    if (question.quiz.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    answer.remove();
    await question.save();

    res.json({
      message: "Answer deleted"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
