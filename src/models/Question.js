const mongoose = require("mongoose");

/**
 * Answer subdocument schema
 */
const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

/**
 * Question schema
 */
const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    // ✅ renamed from questionText → text
    text: {
      type: String,
      required: true,
    },

    // ✅ renamed from description → helpText (matches controller)
    helpText: {
      type: String,
    },

    type: {
      type: String,
      enum: ["single", "multiple"],
      default: "single",
    },

    points: {
      type: Number,
      default: 1,
      min: 1,
    },

    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
