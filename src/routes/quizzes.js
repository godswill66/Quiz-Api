const express = require("express");
const router = express.Router();
const quizCtrl = require("../controllers/quizController");
const auth = require("../middleware/authMiddleware");


router.get("/", auth, quizCtrl.getUserQuizzes);
router.get("/:id", auth, quizCtrl.getQuiz);
router.put("/:id", auth, quizCtrl.updateQuiz);
router.delete("/:id", auth, quizCtrl.deleteQuiz);
router.patch("/:id/archive", auth, quizCtrl.archiveQuiz);

module.exports = router;