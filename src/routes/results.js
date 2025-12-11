const router = require("express").Router();
const auth = require("../middleware/auth");
const resultCtrl = require("../controllers/resultController");

// Submit quiz
router.post("/:quizId/submit", auth, resultCtrl.submitQuiz);

// Get user's results
 router.get("/", auth, resultCtrl.getUserResults);

// Get results for a single quiz
router.get("/:quizId", auth, resultCtrl.getQuizResults);

module.exports = router;
