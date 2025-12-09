const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/quizController');
const auth = require('../middleware/auth');


router.use(auth);
router.post('/', ctrl.createQuiz);
router.get('/', ctrl.getQuizzes);
router.get('/:id', ctrl.getQuiz);
router.put('/:id', ctrl.updateQuiz);
router.delete('/:id', ctrl.deleteQuiz);


module.exports = router;