const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

exports.createQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, helpText } = req.body;

    // The validation check is handled by the middleware now!
    // We can assume quizId is valid here.

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Assuming 'auth' middleware provides req.user
    if (quiz.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    const question = await Question.create({
      quiz: quizId,
      text,
      helpText,
    });

    // Push into quiz.questions array
    quiz.questions.push(question._id);
    await quiz.save();

    res.status(201).json({ message: "Question created", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, helpText } = req.body;

    const question = await Question.findById(id).populate("quiz");
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    if (question.quiz.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    if (text) question.text = text;
    if (helpText) question.helpText = helpText;

    await question.save();
    res.json({ message: "Question updated", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id).populate("quiz");
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    if (question.quiz.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    await question.deleteOne();

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addAnswer = async (req, res) => {
  // Add your logic for adding an answer here.
  res.status(501).json({ message: "Not Implemented Yet" });
};

exports.updateAnswer = async (req, res) => {
  // This is the function causing the error right now.
  // Add your logic for updating an answer here.
  res.status(501).json({ message: "Not Implemented Yet" });
};

exports.deleteAnswer = async (req, res) => {
  // Add your logic for deleting an answer here.
  res.status(501).json({ message: "Not Implemented Yet" });
};
