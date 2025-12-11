// Import the Mongoose Question model for database interactions
const Question = require("../models/Question");
// Import the Mongoose Quiz model for database interactions
const Quiz = require("../models/Quiz");

/**
 * @desc    Create a new question for a specific quiz
 * @route   POST /api/questions/:quizId
 * @access  Private (User must own the quiz)
 */
exports.createQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, helpText } = req.body;

    // The 'validateObjectId' middleware ensures quizId is a valid Mongo ID format.

    // Find the parent quiz document
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Authorization check: Verify that the authenticated user owns this quiz
    if (quiz.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed: User does not own this resource" });

    // Create the new question document, linking it to the parent quiz ID
    const question = await Question.create({
      quiz: quizId,
      text,
      helpText,
    });

    // Add the new question's ID to the parent quiz's questions array (embedded reference)
    quiz.questions.push(question._id);
    await quiz.save(); // Save the updated quiz document

    // Respond with created status and the new question data
    res.status(201).json({ message: "Question created successfully", question });
  } catch (err) {
    // Standard server error handling
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Update an existing question
 * @route   PUT /api/questions/:id
 * @access  Private (User must own the quiz the question belongs to)
 */
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, helpText } = req.body;

    // Find the question and populate the parent quiz for authorization check
    const question = await Question.findById(id).populate("quiz");
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    // Authorization check
    if (question.quiz.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    // Apply updates only if the fields are provided in the request body
    if (text) question.text = text;
    if (helpText) question.helpText = helpText;

    // Save the updated question document
    await question.save();
    res.json({ message: "Question updated successfully", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Delete an existing question
 * @route   DELETE /api/questions/:id
 * @access  Private (User must own the quiz the question belongs to)
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the question and populate the parent quiz for authorization check
    const question = await Question.findById(id).populate("quiz");
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    // Authorization check
    if (question.quiz.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    // Use deleteOne() on the found document to remove it
    await question.deleteOne();

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* --- Answer Management Placeholders (Implementation in previous response) --- */

/**
 * @desc    Add an answer to a question (Placeholder)
 * @route   POST /api/questions/:questionId/answers
 * @access  Private
 */
exports.addAnswer = async (req, res) => {
  // Logic for adding an answer belongs here (see previous commented code snippet)
  res.status(501).json({ message: "Not Implemented Yet" });
};

/**
 * @desc    Update an answer within a question (Placeholder)
 * @route   PUT /api/questions/:questionId/answers/:answerId
 * @access  Private
 */
exports.updateAnswer = async (req, res) => {
  // Logic for updating an answer belongs here (see previous commented code snippet)
  res.status(501).json({ message: "Not Implemented Yet" });
};

/**
 * @desc    Delete an answer within a question (Placeholder)
 * @route   DELETE /api/questions/:questionId/answers/:answerId
 * @access  Private
 */
exports.deleteAnswer = async (req, res) => {
  // Logic for deleting an answer belongs here (see previous commented code snippet)
  res.status(501).json({ message: "Not Implemented Yet" });
};
