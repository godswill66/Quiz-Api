const express = require("express");
const router = express.Router();
const questionCtrl = require("../controllers/questionController");
const auth = require("../middleware/authMiddleware");
const validateObjectId = require("../utils/validateObjectId");

// --- QUESTIONS CRUD ---
router.post("/:quizId", auth, validateObjectId, questionCtrl.createQuestion);
router.put("/:id", auth, validateObjectId, questionCtrl.updateQuestion);
router.delete("/:id", auth, validateObjectId, questionCtrl.deleteQuestion);

// --- ANSWERS CRUD ---
router.post(
  "/:questionId/answers",
  auth,
  validateObjectId,
  questionCtrl.addAnswer
);
router.put(
  "/:questionId/answers/:answerId",
  auth,
  validateObjectId,
  questionCtrl.updateAnswer
);
router.delete(
  "/:questionId/answers/:answerId",
  auth,
  validateObjectId,
  questionCtrl.deleteAnswer
);

module.exports = router;
