// Import the Mongoose library
const mongoose = require("mongoose");

/**
 * @desc    Middleware to validate that request parameters are valid MongoDB Object IDs.
 *          This prevents Mongoose from throwing internal CastError exceptions when an invalid ID format is used.
 * @param   {object} req - Express request object
 * @param   {object} res - Express response object
 * @param   {function} next - Express next middleware function
 */
module.exports = function (req, res, next) {
  // Check multiple possible parameter names for an ID in the URL
  const id =
    req.params.id ||
    req.params.quizId ||
    req.params.questionId ||
    req.params.answerId;

  // Use Mongoose's built-in utility to check the format of the extracted ID
  if (!mongoose.isValidObjectId(id)) {
    // If the format is invalid, stop the request early and return a 400 Bad Request error
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // If the ID format is valid, proceed to the next middleware or the route handler/controller
  next();
};
