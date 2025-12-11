// Import the Mongoose library
const mongoose = require("mongoose");

/**
 * @desc    Defines the schema for an Answer model. 
 *          This approach uses a separate collection for answers (referencing)
 *          rather than embedding answers directly within the Question model (subdocuments).
 */
const answerSchema = new mongoose.Schema(
  {
    // A reference back to the parent Question document
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", // Links this field to the 'Question' model
      required: true,
    },
    // The text content of the answer
    text: {
      type: String,
      required: true,
    },
    // Flag to indicate if this answer is the correct choice
    isCorrect: {
      type: Boolean,
      default: false, // Defaults to false unless specified otherwise
    },
  },
  { 
    // Mongoose option to automatically add `createdAt` and `updatedAt` fields
    timestamps: true 
  }
);

/**
 * @desc    Compiles and exports the Answer model.
 * @exports mongoose.Model<Answer>
 */
module.exports = mongoose.model("Answer", answerSchema);
