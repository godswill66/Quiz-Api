const express = require("express");
const router = express.Router();
const answerCtrl = require("../controllers/answerController");
const auth = require("../middleware/auth");
const validateObjectId = require("../utils/validateObjectId");

// Add answer
router.post("/:questionId", auth, validateObjectId, answerCtrl.addAnswer);

// Update answer
router.put("/:questionId/:answerId", auth, validateObjectId, answerCtrl.updateAnswer);

// Delete answer
router.delete("/:questionId/:answerId", auth, validateObjectId, answerCtrl.deleteAnswer);

module.exports = router;
