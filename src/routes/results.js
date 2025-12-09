const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/resultController');
const auth = require('../middleware/auth');


router.use(auth);
router.post('/:quizId/attempts', ctrl.submitAttempt);
router.get('/mine', ctrl.getUserResults);
router.get('/:quizId/results', ctrl.getQuizResults);


module.exports = router;