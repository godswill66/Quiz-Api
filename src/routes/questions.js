// This file is inside src/routes/questions.js
const express = require("express");
const router = express.Router();
const questionCtrl = require("../controllers/questionController");
const auth = require("../middleware/authMiddleware");
const validateObjectId = require("../utils/validateObjectId");

// --- QUESTIONS CRUD ---

/**
 * @route   POST /api/quizzes/:id/questions
 * Creates a question and links it to the quiz ID provided in the URL
 */
router.post("/quizzes/:id/questions", auth, validateObjectId, questionCtrl.createQuestion);

/**
 * @route   PUT /api/questions/:id
 */
router.put("/questions/:id", auth, validateObjectId, questionCtrl.updateQuestion);

/**
 * @route   DELETE /api/questions/:id
 */
router.delete("/questions/:id", auth, validateObjectId, questionCtrl.deleteQuestion);

// --- ANSWERS CRUD ---

/**
 * @route   POST /api/questions/:id/answers
 */
router.post("/questions/:id/answers", auth, validateObjectId, questionCtrl.addAnswer);

/**
 * @route   PUT /api/questions/:id/answers/:answerId
 */
router.put("/questions/:id/answers/:answerId", auth, validateObjectId, questionCtrl.updateAnswer);

/**
 * @route   DELETE /api/questions/:id/answers/:answerId
 */
router.delete("/questions/:id/answers/:answerId", auth, validateObjectId, questionCtrl.deleteAnswer);

module.exports = router;