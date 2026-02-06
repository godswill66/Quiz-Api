const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

/**
 * @desc    Create a new question for a specific quiz
 * @route   POST /api/quizzes/:id/questions
 */
exports.createQuestion = async (req, res) => {
  try {
    const { text } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = new Question({
      quiz: quizId,
      text: text,
      user: req.user.id
    });

    await question.save();

    if (!quiz.questions) quiz.questions = [];
    quiz.questions.push(question._id);
    await quiz.save();

    res.status(201).json({ message: "Question created successfully", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Update an existing question
 * @route   PUT /api/questions/:id
 */
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, helpText } = req.body;

    const question = await Question.findById(id).populate("quiz");
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (text) question.text = text;
    if (helpText) question.helpText = helpText;

    await question.save();
    res.json({ message: "Question updated successfully", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Delete an existing question
 * @route   DELETE /api/questions/:id
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate("quiz");

    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await question.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Add an answer to a question
 * @route   POST /api/:id/answers
 */
exports.addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isCorrect } = req.body;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.answers.push({ text, isCorrect: isCorrect || false });
    await question.save();

    res.status(200).json({ message: "Answer added successfully", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Update an answer within a question
 * @route   PUT /api/:id/answers/:answerId
 */
exports.updateAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;
    const { text, isCorrect } = req.body;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (text !== undefined) answer.text = text;
    if (isCorrect !== undefined) answer.isCorrect = isCorrect;

    await question.save();
    res.json({ message: "Answer updated successfully", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Delete an answer from a question
 * @route   DELETE /api/:id/answers/:answerId
 */
exports.deleteAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.answers.pull(answerId);
    await question.save();

    res.json({ message: "Answer deleted successfully", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};