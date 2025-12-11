// Import the Mongoose Quiz model for database interactions
const Quiz = require("../models/Quiz");

/**
 * @desc    Create a new quiz
 * @route   POST /api/quizzes
 * @access  Private
 */
exports.createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validate required fields
    if (!title) return res.status(400).json({ message: "Title is required" });

    // Create the new quiz document, linking it to the authenticated user's ID
    const quiz = await Quiz.create({
      title,
      description,
      user: req.user._id, // Assumes 'auth' middleware has populated req.user
    });

    // Respond with created status and the new quiz data
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    // Standard server error handling
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Update an existing quiz details
 * @route   PUT /api/quizzes/:id
 * @access  Private (User must own the quiz)
 */
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    // The 'validateObjectId' middleware ensures 'id' is a valid Mongo ID.

    // Find the quiz, ensuring it belongs to the authenticated user for authorization
    const quiz = await Quiz.findOne({ _id: id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found or user unauthorized" });

    const { title, description, status } = req.body;
    
    // Apply updates only if fields are present in the request body
    if (title) quiz.title = title;
    if (description) quiz.description = description;
    
    // Validate and apply status update
    if (status && ["active", "archived"].includes(status)) quiz.status = status;

    // Save the updated quiz document
    await quiz.save();
    res.json({ message: "Quiz updated successfully", quiz });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Delete a quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (User must own the quiz)
 */
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete the quiz, combining the ID and user ownership check
    const quiz = await Quiz.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!quiz) return res.status(404).json({ message: "Quiz not found or user unauthorized" });

    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Archive or unarchive a quiz
 * @route   PUT /api/quizzes/:id/archive (Specific route might vary, logic for status update is here)
 * @access  Private (User must own the quiz)
 */
exports.archiveQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected "active" or "archived"
    
    // Validate the incoming status value
    if (!["active", "archived"].includes(status))
      return res.status(400).json({ message: "Invalid status provided" });
      
    // Find the quiz, ensuring user ownership
    const quiz = await Quiz.findOne({ _id: id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found or user unauthorized" });

    // Update the status and save
    quiz.status = status;
    await quiz.save();

    res.json({ message: `Quiz status set to ${status}`, quiz });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Fetch all quizzes created by the authenticated user
 * @route   GET /api/quizzes/me
 * @access  Private
 */
exports.getUserQuizzes = async (req, res) => {
  try {
    // Find all quizzes matching the authenticated user's ID
    const quizzes = await Quiz.find({ user: req.user._id });
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * @desc    Fetch a single quiz with its nested questions populated
 * @route   GET /api/quizzes/:id
 * @access  Private (User must own the quiz)
 */
exports.getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the quiz, ensure ownership, and use .populate() to embed related questions
    const quiz = await Quiz.findOne({ _id: id, user: req.user._id })
      .populate({
        path: "questions", // Reference the 'questions' field in the Quiz schema
        select: "-__v", // Exclude the Mongoose version field from the response
      });
      
    if (!quiz) return res.status(404).json({ message: "Quiz not found or user unauthorized" });

    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
