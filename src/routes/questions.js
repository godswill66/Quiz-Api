// This file is inside src/routes/questions.js
const express = require("express");
const router = express.Router();
const questionCtrl = require("../controllers/questionController");
const auth = require("../middleware/authMiddleware");
const validateObjectId = require("../utils/validateObjectId");

// --- QUESTIONS CRUD ---

/**
 * @route   POST /api/quizzes/:id/questions
 * NOTE: Changed from "/:quizId" to "/" because the ID is already
 * provided by the parent router (quizzes.js)
 */
router.post("/", auth, questionCtrl.createQuestion);

/**
 * @route   PUT /api/questions/:id
 * (If you access this directly via /api/questions/:id)
 */
router.put("/:id", auth, validateObjectId, questionCtrl.updateQuestion);
router.delete("/:id", auth, validateObjectId, questionCtrl.deleteQuestion);

// --- ANSWERS CRUD ---
/**
 * @route   POST /api/questions/:questionId/answers
 */ // Route: POST /api/:id/answers
router.post("/:id/answers", auth, questionCtrl.addAnswer);

router.put(
  "/:questionId/answers/:answerId",
  auth,
  validateObjectId,
  questionCtrl.updateAnswer,
);

router.delete(
  "/:questionId/answers/:answerId",
  auth,
  validateObjectId,
  questionCtrl.deleteAnswer,
);

module.exports = router;