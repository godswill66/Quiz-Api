const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

/**
 * @desc    Add a new answer to a specific question
 * @route   POST /api/questions/:questionId/answers
 * @access  Private (User must own the quiz the question belongs to)
 */
exports.addAnswer = async (req, res) => {
  try {
    // Extract IDs and payload from the request
    const { questionId } = req.params;
    const { text, isCorrect } = req.body;

    // Validate essential input
    if (!text) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    // Find the question and populate its parent quiz data
    // The validateObjectId middleware ensures questionId is valid before this runs
    const question = await Question.findById(questionId).populate("quiz");

    // Handle case where question does not exist
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Authorization check: ensure the authenticated user owns the parent quiz
    if (question.quiz.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: User does not own this quiz" });
    }

    // Add the new answer object to the embedded document array
    question.answers.push({ text, isCorrect: !!isCorrect });

    // Save the parent question document
    await question.save();

    // Respond with success message and the updated question object
    res.status(201).json({
      message: "Answer added successfully",
      question,
    });
  } catch (err) {
    // Generic error handling
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Update a specific answer within a question
 * @route   PUT /api/questions/:questionId/answers/:answerId
 * @access  Private (User must own the quiz the question belongs to)
 */
exports.updateAnswer = async (req, res) => {
  try {
    // Extract IDs and potential updates from the request
    const { questionId, answerId } = req.params;
    const { text, isCorrect } = req.body;

    // Find the question and populate its parent quiz data
    const question = await Question.findById(questionId).populate("quiz");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Authorization check
    if (question.quiz.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find the specific embedded answer document using Mongoose's .id() method
    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Apply updates if the fields are present in the request body
    if (text) answer.text = text;
    // Check specifically for undefined as isCorrect can legitimately be false
    if (isCorrect !== undefined) answer.isCorrect = isCorrect;

    // Save the changes to the parent document
    await question.save();

    // Respond with success message and the updated question object
    res.json({
      message: "Answer updated successfully",
      question,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Delete a specific answer within a question
 * @route   DELETE /api/questions/:questionId/answers/:answerId
 * @access  Private (User must own the quiz the question belongs to)
 */
exports.deleteAnswer = async (req, res) => {
  try {
    // Extract IDs from request parameters
    const { questionId, answerId } = req.params;

    // Find the question and populate its parent quiz data
    const question = await Question.findById(questionId).populate("quiz");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Authorization check
    if (question.quiz.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find the specific embedded answer document
    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Remove the embedded document from the array
    question.answers.pull(answerId);
    // Save the change to the database
    await question.save();

    // Respond with success message (no need to send the full object back for a delete)
    res.json({
      message: "Answer deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
