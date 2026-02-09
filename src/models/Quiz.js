const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    status: { 
      type: String, 
      enum: ["active", "archived"], 
      default: "active" 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    // ADD THIS FIELD BELOW:
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question" // This must match your Question model name
      }
    ]
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Quiz", quizSchema);