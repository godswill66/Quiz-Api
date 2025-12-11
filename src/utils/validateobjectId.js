const mongoose = require("mongoose");

// This is middleware: it runs between the request and the controller
module.exports = function (req, res, next) {
  const id =
    req.params.id ||
    req.params.quizId ||
    req.params.questionId ||
    req.params.answerId;

  // If any of the potential IDs are invalid, stop the request and send a 400 error
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // If valid, continue to the next middleware/controller
  next();
};
