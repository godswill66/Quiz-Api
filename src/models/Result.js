const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: { type: Number, required: true },
    grade: { type: String, required: true },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        selectedAnswers: [String],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Result", resultSchema);
