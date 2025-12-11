const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    questionText: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["single", "multiple"], default: "single" },
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
