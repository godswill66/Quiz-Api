const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  const { quizId, id, questionId, answerId } = req.params;

  const ids = [quizId, id, questionId, answerId].filter(Boolean);
  for (const _id of ids) {
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
  }

  next();
};
