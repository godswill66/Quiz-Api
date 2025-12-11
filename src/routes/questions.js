const express = require("express");
const router = express.Router();
const questionCtrl = require("../controllers/questionController");
const auth = require("../middleware/auth");
const validateObjectId = require("../utils/validateObjectId");

// Create question for quiz (Validates the quizId param)
router.post("/:quizId", auth, validateObjectId, questionCtrl.createQuestion);

// Update a question (Validates the :id param)
router.put("/:id", auth, validateObjectId, questionCtrl.updateQuestion);

// Delete a question (Validates the :id param)
router.delete("/:id", auth, validateObjectId, questionCtrl.deleteQuestion);

// ----- ANSWER management ------

// Add answer to question (Validates the :questionId param)
// This route was missing in your previous prompt but needed for context if you have the controller logic
router.post("/:questionId/answers", auth, validateObjectId, questionCtrl.addAnswer); 

// Update answer (Validates both IDs using the middleware's internal logic)
router.put(
  "/:questionId/answers/:answerId",
  auth,
  validateObjectId, // Added validateObjectId here to check both params
  questionCtrl.updateAnswer
);

// Delete answer (Validates both IDs using the middleware's internal logic)
router.delete(
  "/:questionId/answers/:answerId",
  auth,
  validateObjectId,
  questionCtrl.deleteAnswer
);

module.exports = router;
