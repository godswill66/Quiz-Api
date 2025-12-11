// Import the Mongoose library
const mongoose = require("mongoose");

/**
 * @desc    Defines the schema for embedded Answer subdocuments.
 *          These documents will live inside the 'answers' array of the Question model.
 */
const answerSchema = new mongoose.Schema({
  // The text content of the answer choice
  text: { 
    type: String, 
    required: true 
  },
  // Flag to indicate if this choice is a correct answer
  isCorrect: { 
    type: Boolean, 
    default: false // Defaults to false
  },
}, { _id: true } ); // Mongoose automatically manages _id for subdocuments

/**
 * @desc    Defines the main schema for the Question model.
 */
const questionSchema = new mongoose.Schema(
  {
    // A reference to the parent Quiz document
    quiz: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Quiz", // Links this field to the 'Quiz' model
      required: true 
    },
    // The main text or prompt of the question
    questionText: { 
      type: String, 
      required: true 
    },
    // Optional additional context or help text for the question
    description: { 
      type: String 
    },
    // The type of question (e.g., single choice vs. multiple choice)
    type: { 
      type: String, 
      enum: ["single", "multiple"], // Restricts values to only these two options
      default: "single" 
    },
    // An array of embedded answer subdocuments using the answerSchema defined above
    answers: [answerSchema],
  },
  { 
    // Mongoose option to automatically add `createdAt` and `updatedAt` fields
    timestamps: true 
  }
);

/**
 * @desc    Compiles and exports the Question model.
 * @exports mongoose.Model<Question>
 */
module.exports = mongoose.model("Question", questionSchema);
