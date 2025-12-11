// Import the Mongoose library
const mongoose = require("mongoose");

/**
 * @desc    Defines the main schema for the Quiz model.
 *          This schema focuses on high-level quiz metadata and a reference to the creator.
 *          Note: The 'questions' field is managed separately via population in the controller,
 *          rather than being defined within this top-level schema definition.
 */
const quizSchema = new mongoose.Schema(
  {
    // The main title of the quiz (required field)
    title: { 
      type: String, 
      required: true 
    },
    // Optional description or introduction for the quiz
    description: { 
      type: String 
    },
    // The current state of the quiz
    status: { 
      type: String, 
      enum: ["active", "archived"], // Restricts values to only these two options
      default: "active" // Default status is 'active'
    },
    // A reference to the user who created the quiz
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", // Links this field to the 'User' model
      required: true 
    },
  },
  { 
    // Mongoose option to automatically add `createdAt` and `updatedAt` fields
    timestamps: true 
  }
);

/**
 * @desc    Compiles and exports the Quiz model.
 * @exports mongoose.Model<Quiz>
 */
module.exports = mongoose.model("Quiz", quizSchema);
