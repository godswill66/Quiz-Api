const Quiz = require("../models/Quiz");


// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const quiz = await Quiz.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update quiz details
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    // The middleware ensures 'id' is valid before this point
    const quiz = await Quiz.findOne({ _id: id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const { title, description, status } = req.body;
    if (title) quiz.title = title;
    if (description) quiz.description = description;
    if (status && ["active", "archived"].includes(status)) quiz.status = status;

    await quiz.save();
    res.json({ message: "Quiz updated", quiz });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    // The middleware ensures 'id' is valid before this point
    const quiz = await Quiz.findOneAndDelete({ _id: id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Archive / unarchive a quiz
exports.archiveQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected "active" or "archived"
    if (!["active", "archived"].includes(status))
      return res.status(400).json({ message: "Invalid status" });
      
    // The middleware ensures 'id' is valid before this point
    const quiz = await Quiz.findOne({ _id: id, user: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    quiz.status = status;
    await quiz.save();

    res.json({ message: `Quiz ${status}`, quiz });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch all quizzes by authenticated user
exports.getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user._id });
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch a single quiz with nested questions
exports.getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    // The middleware ensures 'id' is valid before this point
    const quiz = await Quiz.findOne({ _id: id, user: req.user._id })
      .populate({
        path: "questions", // will link Question model to quiz later
        select: "-__v",
      });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
